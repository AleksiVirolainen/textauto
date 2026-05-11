import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddressBookEntity } from "../address-book/address-book.entity";
import { CampaignEntity } from "./campaign.entity";
import { CampaignItemEntity } from "./campaign-item.entity";

export interface CampaignItemInput {
  phone: string;
  tags?: string;
  groupName?: string;
  op?: string;
}

export interface CreateCampaignInput {
  username: string;
  title?: string;
  ratePerHourMin: number;
  ratePerHourMax: number;
  workHourStart?: number;
  workHourEnd?: number;
  defaultGroupName?: string;
  defaultTags?: string;
  defaultOp?: string;
  items: CampaignItemInput[];
}

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);
  private tickRunning = false;

  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: Repository<CampaignEntity>,
    @InjectRepository(CampaignItemEntity)
    private readonly itemRepo: Repository<CampaignItemEntity>,
    @InjectRepository(AddressBookEntity)
    private readonly addressBookRepo: Repository<AddressBookEntity>
  ) {}

  // -------- CRUD --------

  async create(input: CreateCampaignInput) {
    const min = Math.max(1, Math.min(input.ratePerHourMin, input.ratePerHourMax));
    const max = Math.max(min, input.ratePerHourMax);
    const workStart = clampHour(input.workHourStart ?? 9);
    const workEnd = clampHour(input.workHourEnd ?? 22);

    const campaign = this.campaignRepo.create({
      username: input.username,
      title: input.title ?? "",
      ratePerHourMin: min,
      ratePerHourMax: max,
      workHourStart: workStart,
      workHourEnd: workEnd,
      defaultGroupName: input.defaultGroupName ?? "",
      defaultTags: input.defaultTags ?? "",
      defaultOp: input.defaultOp ?? "",
      status: "running",
      totalCount: input.items.length,
      insertedCount: 0,
      failedCount: 0,
      lastInsertedAt: null,
      nextScheduledAt: this.computeFirstSchedule(new Date(), workStart, workEnd, min, max)
    });
    const saved = await this.campaignRepo.save(campaign);

    if (input.items.length > 0) {
      const rows = input.items.map((it) =>
        this.itemRepo.create({
          campaignId: saved.id,
          phone: it.phone,
          tags: it.tags ?? input.defaultTags ?? "",
          groupName: it.groupName ?? input.defaultGroupName ?? "",
          op: it.op ?? input.defaultOp ?? "",
          status: "pending"
        })
      );
      await this.itemRepo.save(rows);
    }

    return this.get(saved.id);
  }

  async list() {
    return this.campaignRepo.find({ order: { id: "DESC" } });
  }

  async get(id: number) {
    const row = await this.campaignRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException("任务不存在");
    return row;
  }

  async items(campaignId: number, status?: string) {
    const where: Record<string, unknown> = { campaignId };
    if (status) where.status = status;
    return this.itemRepo.find({ where, order: { id: "ASC" } });
  }

  async pause(id: number) {
    const c = await this.get(id);
    if (c.status === "running") c.status = "paused";
    return this.campaignRepo.save(c);
  }

  async resume(id: number) {
    const c = await this.get(id);
    if (c.status === "paused") {
      c.status = "running";
      c.nextScheduledAt = this.computeFirstSchedule(
        new Date(),
        c.workHourStart,
        c.workHourEnd,
        c.ratePerHourMin,
        c.ratePerHourMax
      );
    }
    return this.campaignRepo.save(c);
  }

  async cancel(id: number) {
    const c = await this.get(id);
    c.status = "canceled";
    return this.campaignRepo.save(c);
  }

  async remove(id: number) {
    await this.itemRepo.delete({ campaignId: id });
    await this.campaignRepo.delete(id);
    return { ok: true };
  }

  // -------- tick --------

  @Cron(CronExpression.EVERY_MINUTE)
  async tick() {
    if (this.tickRunning) return;
    this.tickRunning = true;
    try {
      const now = new Date();
      const running = await this.campaignRepo.find({ where: { status: "running" } });
      for (const c of running) {
        await this.tickOne(c, now);
      }
    } catch (err) {
      this.logger.error("tick failed: " + (err as Error).message);
    } finally {
      this.tickRunning = false;
    }
  }

  private async tickOne(c: CampaignEntity, now: Date) {
    if (!this.inWorkHours(now, c.workHourStart, c.workHourEnd)) return;
    if (c.nextScheduledAt && c.nextScheduledAt.getTime() > now.getTime()) return;

    const item = await this.itemRepo.findOne({
      where: { campaignId: c.id, status: "pending" },
      order: { id: "ASC" }
    });

    if (!item) {
      c.status = "done";
      c.nextScheduledAt = null;
      await this.campaignRepo.save(c);
      return;
    }

    try {
      const row = this.addressBookRepo.create({
        username: c.username,
        name: "",
        phone: item.phone,
        groupName: item.groupName || c.defaultGroupName,
        tags: item.tags || c.defaultTags,
        op: item.op || c.defaultOp
      });
      await this.addressBookRepo.save(row);

      item.status = "inserted";
      item.insertedAt = now;
      await this.itemRepo.save(item);

      c.insertedCount += 1;
      c.lastInsertedAt = now;
    } catch (err) {
      item.status = "failed";
      item.failReason = (err as Error).message.slice(0, 240);
      await this.itemRepo.save(item);
      c.failedCount += 1;
    }

    c.nextScheduledAt = this.computeNextSchedule(
      now,
      c.workHourStart,
      c.workHourEnd,
      c.ratePerHourMin,
      c.ratePerHourMax
    );
    await this.campaignRepo.save(c);
  }

  // -------- helpers --------

  private inWorkHours(now: Date, start: number, end: number) {
    const h = now.getHours();
    if (start === end) return false;
    if (start < end) return h >= start && h < end;
    return h >= start || h < end;
  }

  private computeFirstSchedule(
    now: Date,
    start: number,
    end: number,
    rateMin: number,
    rateMax: number
  ) {
    if (this.inWorkHours(now, start, end)) {
      const delay = this.randomIntervalMs(rateMin, rateMax);
      return new Date(now.getTime() + Math.round(delay * 0.2));
    }
    return this.nextWorkStart(now, start);
  }

  private computeNextSchedule(
    now: Date,
    start: number,
    end: number,
    rateMin: number,
    rateMax: number
  ) {
    const interval = this.randomIntervalMs(rateMin, rateMax);
    const candidate = new Date(now.getTime() + interval);
    if (this.inWorkHours(candidate, start, end)) return candidate;
    return this.nextWorkStart(candidate, start);
  }

  private randomIntervalMs(rateMin: number, rateMax: number) {
    const rate = rateMin + Math.random() * (rateMax - rateMin);
    const base = 3_600_000 / Math.max(1, rate);
    const jitter = 0.8 + Math.random() * 0.4;
    return Math.round(base * jitter);
  }

  private nextWorkStart(from: Date, startHour: number) {
    const d = new Date(from);
    d.setMinutes(0, 0, 0);
    if (d.getHours() >= startHour) d.setDate(d.getDate() + 1);
    d.setHours(startHour);
    return d;
  }

  // -------- 工具：解析批量粘贴文本 --------

  static parseItems(
    text: string,
    fallback: { tags?: string; groupName?: string; op?: string }
  ): CampaignItemInput[] {
    const out: CampaignItemInput[] = [];
    const lines = text.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const parts = line
        .split(/[,\t，；; ]+/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length === 0) continue;
      const phone = parts[0];
      if (!/^\d{6,}$/.test(phone)) continue;
      out.push({
        phone,
        tags: parts[1] ?? fallback.tags,
        groupName: parts[2] ?? fallback.groupName,
        op: parts[3] ?? fallback.op
      });
    }
    return out;
  }
}

function clampHour(h: number) {
  if (!Number.isFinite(h)) return 9;
  return Math.max(0, Math.min(23, Math.trunc(h)));
}

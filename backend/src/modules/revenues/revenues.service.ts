import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import jsQR from "jsqr";
import { Jimp } from "jimp";
import { Repository } from "typeorm";
import { RevenuePointEntity } from "./revenue-point.entity";
import { RevenueRecordEntity } from "./revenue-record.entity";

interface AmountDetectResult {
  amountCents: number;
  strategy: string;
}

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(RevenuePointEntity)
    private readonly pointsRepo: Repository<RevenuePointEntity>,
    @InjectRepository(RevenueRecordEntity)
    private readonly recordsRepo: Repository<RevenueRecordEntity>
  ) {}

  async listPoints() {
    const rows = await this.pointsRepo.find({ order: { pointName: "ASC" } });
    return rows.map((row) => this.toPointView(row));
  }

  async upsertPoint(pointName: string, commissionRatePercent: number) {
    const normalizedName = pointName.trim();
    if (!normalizedName) {
      throw new BadRequestException("点位名称不能为空");
    }
    const rateBps = percentToBps(commissionRatePercent);
    if (rateBps < 0 || rateBps > 10_000) {
      throw new BadRequestException("抽成比例必须在 0% 到 100% 之间");
    }

    let row = await this.pointsRepo.findOne({ where: { pointName: normalizedName } });
    if (!row) {
      row = this.pointsRepo.create({
        pointName: normalizedName,
        commissionRateBps: rateBps
      });
    } else {
      row.commissionRateBps = rateBps;
    }
    const saved = await this.pointsRepo.save(row);
    return this.toPointView(saved);
  }

  async listRecords(pointName?: string) {
    const where = pointName?.trim() ? { pointName: pointName.trim() } : {};
    const rows = await this.recordsRepo.find({
      where,
      order: { id: "DESC" },
      take: 200
    });
    return rows.map((row) => this.toRecordView(row));
  }

  async scanAndCreateRecord(pointName: string, fileBuffer: Buffer) {
    const normalizedName = pointName.trim();
    if (!normalizedName) {
      throw new BadRequestException("点位名称不能为空");
    }

    const point = await this.pointsRepo.findOne({ where: { pointName: normalizedName } });
    if (!point) {
      throw new NotFoundException("点位不存在，请先配置点位抽成比例");
    }

    const qrPayload = await this.decodeQrPayload(fileBuffer);
    const amountResult = this.detectAmount(qrPayload);
    if (!amountResult) {
      throw new BadRequestException(
        "二维码中未识别到金额。请使用带金额参数的收款码，或调整识别规则。"
      );
    }

    const commissionCents = Math.round(
      (amountResult.amountCents * point.commissionRateBps) / 10_000
    );
    const netAmountCents = amountResult.amountCents - commissionCents;

    const row = this.recordsRepo.create({
      pointName: point.pointName,
      amountCents: amountResult.amountCents,
      commissionRateBps: point.commissionRateBps,
      commissionCents,
      netAmountCents,
      qrPayload,
      detectStrategy: amountResult.strategy
    });

    const saved = await this.recordsRepo.save(row);
    return this.toRecordView(saved);
  }

  private async decodeQrPayload(fileBuffer: Buffer) {
    try {
      const image = await Jimp.read(fileBuffer);
      const { data, width, height } = image.bitmap;
      const code = jsQR(new Uint8ClampedArray(data), width, height);
      if (!code?.data) {
        throw new BadRequestException("二维码无法识别，请上传清晰图片");
      }
      return code.data;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException(
        "二维码解析失败，请确认上传的是包含二维码的图片",
        {
          cause: err as Error
        }
      );
    }
  }

  private detectAmount(payload: string): AmountDetectResult | null {
    // 1) 常见 URL Query 参数
    const queryResult = detectAmountFromQuery(payload);
    if (queryResult) return queryResult;

    // 2) 文本中带币种符号，如 "￥12.34" / "金额:12.34"
    const currencyMatch = payload.match(
      /(?:金额|收款|money|amount|¥|￥)\s*[:：]?\s*(\d+(?:\.\d{1,2})?)/i
    );
    if (currencyMatch?.[1]) {
      const cents = yuanTextToCents(currencyMatch[1]);
      if (cents !== null) {
        return {
          amountCents: cents,
          strategy: "keyword-currency-pattern"
        };
      }
    }

    return null;
  }

  private toPointView(row: RevenuePointEntity) {
    return {
      id: row.id,
      pointName: row.pointName,
      commissionRatePercent: bpsToPercent(row.commissionRateBps),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private toRecordView(row: RevenueRecordEntity) {
    return {
      id: row.id,
      pointName: row.pointName,
      amountCents: row.amountCents,
      amountYuan: centsToYuan(row.amountCents),
      commissionRatePercent: bpsToPercent(row.commissionRateBps),
      commissionCents: row.commissionCents,
      commissionYuan: centsToYuan(row.commissionCents),
      netAmountCents: row.netAmountCents,
      netAmountYuan: centsToYuan(row.netAmountCents),
      detectStrategy: row.detectStrategy,
      qrPayload: row.qrPayload,
      createdAt: row.createdAt
    };
  }
}

function centsToYuan(cents: number) {
  return (cents / 100).toFixed(2);
}

function percentToBps(percent: number) {
  return Math.round(percent * 100);
}

function bpsToPercent(bps: number) {
  return Number((bps / 100).toFixed(2));
}

function yuanTextToCents(amountText: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(amountText)) return null;
  const value = Number(amountText);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

function detectAmountFromQuery(payload: string): AmountDetectResult | null {
  let querySource = payload.trim();
  if (!querySource) return null;

  // 纯 query 字符串场景：amount=12.34&...
  if (!querySource.includes("://") && querySource.includes("=") && !querySource.startsWith("http")) {
    querySource = `https://dummy.local/?${querySource.replace(/^\?/, "")}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(querySource);
  } catch {
    return null;
  }

  const asYuanKeys = [
    "amount",
    "money",
    "total_amount",
    "totalAmount",
    "price",
    "am",
    "amt"
  ];
  for (const key of asYuanKeys) {
    const value = parsed.searchParams.get(key);
    if (!value) continue;
    const cents = yuanTextToCents(value.trim());
    if (cents !== null) {
      return {
        amountCents: cents,
        strategy: `query:${key}`
      };
    }
  }

  const asCentKeys = ["total_fee", "totalFee", "fee"];
  for (const key of asCentKeys) {
    const value = parsed.searchParams.get(key);
    if (!value) continue;
    if (!/^\d+$/.test(value.trim())) continue;
    const cents = Number(value.trim());
    if (!Number.isSafeInteger(cents) || cents < 0) continue;
    return {
      amountCents: cents,
      strategy: `query:${key}-cents`
    };
  }

  return null;
}

import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HomeTaskEntity } from "./home-task.entity";

const BANK_CONTENT =
  "【农业银行】尊敬的客户您好，您在我行可以申领一笔368000元授额，期限3年随用随还，如有需要请及时回复，回复1查利率，回复2办理，退订回T";

const SEED: Array<Partial<HomeTaskEntity>> = [
  {
    username: "13057799720",
    taskId: "T20260508001",
    customerAccount: "13057799720",
    status: "成功",
    reportCount: 20000,
    meteringCount: 20000,
    submitTime: "2026-05-08 10:00:00",
    sendTime: "2026-05-08 10:01:30",
    content: BANK_CONTENT
  },
  {
    username: "13057799720",
    taskId: "T20260507001",
    customerAccount: "13057799720",
    status: "成功",
    reportCount: 12000,
    meteringCount: 12000,
    submitTime: "2026-05-07 10:00:00",
    sendTime: "2026-05-07 10:01:30",
    content: BANK_CONTENT
  },
  {
    username: "15957736312",
    taskId: "T20260509101",
    customerAccount: "15957736312",
    status: "成功",
    reportCount: 16000,
    meteringCount: 16000,
    submitTime: "2026-05-09 10:00:00",
    sendTime: "2026-05-09 10:01:30",
    content: BANK_CONTENT
  },
  {
    username: "15957736312",
    taskId: "T20260508101",
    customerAccount: "15957736312",
    status: "成功",
    reportCount: 16000,
    meteringCount: 16000,
    submitTime: "2026-05-08 10:00:00",
    sendTime: "2026-05-08 10:01:30",
    content: BANK_CONTENT
  }
];

export interface HomeTaskInput {
  username: string;
  taskId: string;
  customerAccount: string;
  status: string;
  reportCount: number;
  meteringCount: number;
  submitTime: string;
  sendTime?: string;
  content: string;
}

@Injectable()
export class HomeTasksService implements OnModuleInit {
  constructor(
    @InjectRepository(HomeTaskEntity)
    private readonly repo: Repository<HomeTaskEntity>
  ) {}

  async onModuleInit() {
    const total = await this.repo.count();
    if (total === 0) {
      await this.repo.save(this.repo.create(SEED as HomeTaskEntity[]));
    }
  }

  list(username?: string) {
    const where = username ? { username } : {};
    return this.repo.find({ where, order: { submitTime: "DESC", id: "DESC" } });
  }

  async getById(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException("任务不存在");
    return row;
  }

  create(input: HomeTaskInput) {
    return this.repo.save(this.repo.create(input));
  }

  async update(id: number, input: Partial<HomeTaskInput>) {
    const row = await this.getById(id);
    Object.assign(row, input);
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.getById(id);
    await this.repo.remove(row);
    return { ok: true };
  }
}

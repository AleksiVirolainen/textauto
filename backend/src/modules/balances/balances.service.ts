import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserBalanceEntity } from "./balance.entity";

const SEED: Record<string, number> = {
  "13057799720": 89021,
  "15957736312": 319234
};

@Injectable()
export class BalancesService implements OnModuleInit {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly repo: Repository<UserBalanceEntity>
  ) {}

  async onModuleInit() {
    for (const [username, balance] of Object.entries(SEED)) {
      const exists = await this.repo.findOne({ where: { username } });
      if (!exists) {
        await this.repo.save(this.repo.create({ username, balance }));
      }
    }
  }

  list() {
    return this.repo.find({ order: { username: "ASC" } });
  }

  async getByUsername(username: string) {
    let row = await this.repo.findOne({ where: { username } });
    if (!row) {
      row = await this.repo.save(this.repo.create({ username, balance: 0 }));
    }
    return row;
  }

  async setByUsername(username: string, balance: number) {
    let row = await this.repo.findOne({ where: { username } });
    if (!row) {
      row = this.repo.create({ username, balance });
    } else {
      row.balance = balance;
    }
    return this.repo.save(row);
  }
}

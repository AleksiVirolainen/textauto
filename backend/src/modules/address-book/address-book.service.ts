import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddressBookEntity } from "./address-book.entity";

const SEED_13057799720: Array<Partial<AddressBookEntity>> = [
  { phone: "15657769129", tags: "1" },
  { phone: "13868395048", tags: "1" },
  { phone: "13057758880", tags: "1" },
  { phone: "15158681686", tags: "1" },
  { phone: "15858723981", tags: "2" },
  { phone: "15657738344", tags: "1" },
  { phone: "15068297914", tags: "1" },
  { phone: "13587963678", tags: "1" },
  { phone: "13291723158", tags: "1" },
  { phone: "13868439418", tags: "1" },
  { phone: "13262351263", tags: "1" },
  { phone: "13868768899", tags: "2" },
  { phone: "15669822397", tags: "1" },
  { phone: "15858854933", tags: "1" },
  { phone: "13075779920", tags: "1" },
  { phone: "18006692538", tags: "1" },
  { phone: "13285777378", tags: "2" },
  { phone: "17326793694", tags: "1" },
  { phone: "13057700651", tags: "1" },
  { phone: "15224107647", tags: "1" },
  { phone: "15558707072", tags: "1" },
  { phone: "13868476769", tags: "1" },
  { phone: "13057811233", tags: "1" },
  { phone: "13736392768", tags: "1" },
  { phone: "15558809051", tags: "1" },
  { phone: "15158581100", tags: "1" },
  { phone: "13115862513", tags: "1" },
  { phone: "15067871113", tags: "2" },
  { phone: "15557580399", tags: "1" }
].map((item) => ({
  ...item,
  username: "13057799720",
  name: "",
  groupName: "农业银行",
  op: ""
}));

const SEED_15957736312: Array<Partial<AddressBookEntity>> = [
  { phone: "13587873993", tags: "1" },
  { phone: "13606872183", tags: "1" },
  { phone: "13566212801", tags: "1" },
  { phone: "13868722666", tags: "1" },
  { phone: "15258057677", tags: "1" },
  { phone: "13587783863", tags: "TD" },
  { phone: "13757731221", tags: "1" },
  { phone: "18958822582", tags: "1" },
  { phone: "15858505098", tags: "1" },
  { phone: "13107777600", tags: "1" },
  { phone: "15869489811", tags: "2" },
  { phone: "18906641383", tags: "1" },
  { phone: "18657789575", tags: "2" },
  { phone: "13353345999", tags: "1" },
  { phone: "18758782668", tags: "TD" },
  { phone: "13091995000", tags: "1" },
  { phone: "18815052861", tags: "2" },
  { phone: "13587855121", tags: "1" },
  { phone: "18767793030", tags: "1" },
  { phone: "15867749993", tags: "1" },
  { phone: "18806778570", tags: "1" },
  { phone: "18066398788", tags: "2" },
  { phone: "13336956187", tags: "1" },
  { phone: "18968995000", tags: "TD" },
  { phone: "15305779038", tags: "1" },
  { phone: "18815005881", tags: "1" },
  { phone: "18968881387", tags: "2" },
  { phone: "18757758677", tags: "1" },
  { phone: "13506871768", tags: "1" },
  { phone: "18368748098", tags: "2" },
  { phone: "13506542117", tags: "1" },
  { phone: "13506876255", tags: "TD" },
  { phone: "13355882368", tags: "1" },
  { phone: "13388599500", tags: "1" },
  { phone: "18968992826", tags: "1" },
  { phone: "18989781929", tags: "1" },
  { phone: "13362727850", tags: "1" }
].map((item) => ({
  ...item,
  username: "15957736312",
  name: "",
  groupName: "农业银行",
  op: "5.8"
}));

export interface AddressBookInput {
  username: string;
  name?: string;
  phone: string;
  groupName?: string;
  tags?: string;
  op?: string;
}

@Injectable()
export class AddressBookService implements OnModuleInit {
  constructor(
    @InjectRepository(AddressBookEntity)
    private readonly repo: Repository<AddressBookEntity>
  ) {}

  async onModuleInit() {
    const total = await this.repo.count();
    if (total === 0) {
      await this.repo.save(this.repo.create(SEED_13057799720 as AddressBookEntity[]));
      await this.repo.save(this.repo.create(SEED_15957736312 as AddressBookEntity[]));
    }
  }

  list(username?: string) {
    const where = username ? { username } : {};
    return this.repo.find({ where, order: { id: "ASC" } });
  }

  async getById(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException("联系人不存在");
    return row;
  }

  create(input: AddressBookInput) {
    const row = this.repo.create({
      username: input.username,
      name: input.name ?? "",
      phone: input.phone,
      groupName: input.groupName ?? "",
      tags: input.tags ?? "",
      op: input.op ?? ""
    });
    return this.repo.save(row);
  }

  async bulkCreate(input: { username: string; replace: boolean; items: AddressBookInput[] }) {
    if (input.replace) {
      await this.repo.delete({ username: input.username });
    }
    const rows = input.items.map((item) =>
      this.repo.create({
        username: input.username,
        name: item.name ?? "",
        phone: item.phone,
        groupName: item.groupName ?? "",
        tags: item.tags ?? "",
        op: item.op ?? ""
      })
    );
    if (rows.length === 0) return { inserted: 0 };
    await this.repo.save(rows);
    return { inserted: rows.length };
  }

  async update(id: number, input: Partial<AddressBookInput>) {
    const row = await this.getById(id);
    if (input.name !== undefined) row.name = input.name;
    if (input.phone !== undefined) row.phone = input.phone;
    if (input.groupName !== undefined) row.groupName = input.groupName;
    if (input.tags !== undefined) row.tags = input.tags;
    if (input.op !== undefined) row.op = input.op;
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.getById(id);
    await this.repo.remove(row);
    return { ok: true };
  }

  async clear(username: string) {
    const result = await this.repo.delete({ username });
    return { deleted: result.affected ?? 0 };
  }
}

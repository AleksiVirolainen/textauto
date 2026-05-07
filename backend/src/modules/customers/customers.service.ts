import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerEntity } from "./customer.entity";

@Injectable()
export class CustomersService implements OnModuleInit {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>
  ) {}

  async onModuleInit() {
    const count = await this.customerRepo.count();
    if (count === 0) {
      await this.customerRepo.save(
        this.customerRepo.create({
          customerCode: "CUST001",
          name: "示例客户A",
          contactPhone: "13800000000"
        })
      );
    }
  }

  list() {
    return this.customerRepo.find({ order: { id: "ASC" } });
  }

  async create(dto: CreateCustomerDto) {
    const exists = await this.customerRepo.findOne({
      where: { customerCode: dto.customerCode }
    });
    if (exists) {
      throw new ConflictException(`客户编号 ${dto.customerCode} 已存在`);
    }
    const entity = this.customerRepo.create({
      customerCode: dto.customerCode,
      name: dto.name,
      contactPhone: dto.contactPhone ?? null
    });
    return this.customerRepo.save(entity);
  }
}

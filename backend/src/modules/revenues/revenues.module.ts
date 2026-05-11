import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RevenuePointEntity } from "./revenue-point.entity";
import { RevenueRecordEntity } from "./revenue-record.entity";
import { RevenuesController } from "./revenues.controller";
import { RevenuesService } from "./revenues.service";

@Module({
  imports: [TypeOrmModule.forFeature([RevenuePointEntity, RevenueRecordEntity])],
  controllers: [RevenuesController],
  providers: [RevenuesService]
})
export class RevenuesModule {}

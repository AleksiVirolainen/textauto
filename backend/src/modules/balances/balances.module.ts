import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBalanceEntity } from "./balance.entity";
import { BalancesController } from "./balances.controller";
import { BalancesService } from "./balances.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserBalanceEntity])],
  controllers: [BalancesController],
  providers: [BalancesService]
})
export class BalancesModule {}

import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { IsInt, Min } from "class-validator";
import { BalancesService } from "./balances.service";

class UpdateBalanceDto {
  @IsInt()
  @Min(0)
  balance!: number;
}

@Controller("balances")
export class BalancesController {
  constructor(private readonly service: BalancesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(":username")
  getOne(@Param("username") username: string) {
    return this.service.getByUsername(username);
  }

  @Put(":username")
  update(@Param("username") username: string, @Body() body: UpdateBalanceDto) {
    return this.service.setByUsername(username, body.balance);
  }
}

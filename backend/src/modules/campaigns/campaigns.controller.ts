import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query
} from "@nestjs/common";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { CampaignsService } from "./campaigns.service";

class CreateCampaignDto {
  @IsString() username!: string;
  @IsOptional() @IsString() title?: string;

  @IsInt() @Min(1) @Max(60) ratePerHourMin!: number;
  @IsInt() @Min(1) @Max(60) ratePerHourMax!: number;

  @IsOptional() @IsInt() @Min(0) @Max(23) workHourStart?: number;
  @IsOptional() @IsInt() @Min(0) @Max(23) workHourEnd?: number;

  @IsOptional() @IsString() defaultGroupName?: string;
  @IsOptional() @IsString() defaultTags?: string;
  @IsOptional() @IsString() defaultOp?: string;

  @IsString() text!: string;
}

@Controller("campaigns")
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @Get(":id/items")
  items(
    @Param("id", ParseIntPipe) id: number,
    @Query("status") status?: string
  ) {
    return this.service.items(id, status);
  }

  @Post()
  async create(@Body() body: CreateCampaignDto) {
    const items = CampaignsService.parseItems(body.text, {
      tags: body.defaultTags,
      groupName: body.defaultGroupName,
      op: body.defaultOp
    });
    return this.service.create({
      username: body.username,
      title: body.title,
      ratePerHourMin: body.ratePerHourMin,
      ratePerHourMax: body.ratePerHourMax,
      workHourStart: body.workHourStart,
      workHourEnd: body.workHourEnd,
      defaultGroupName: body.defaultGroupName,
      defaultTags: body.defaultTags,
      defaultOp: body.defaultOp,
      items
    });
  }

  @Post(":id/pause")
  pause(@Param("id", ParseIntPipe) id: number) {
    return this.service.pause(id);
  }

  @Post(":id/resume")
  resume(@Param("id", ParseIntPipe) id: number) {
    return this.service.resume(id);
  }

  @Post(":id/cancel")
  cancel(@Param("id", ParseIntPipe) id: number) {
    return this.service.cancel(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { HomeTasksService } from "./home-tasks.service";

class HomeTaskDto {
  @IsString() username!: string;
  @IsString() taskId!: string;
  @IsString() customerAccount!: string;
  @IsString() status!: string;
  @IsInt() @Min(0) reportCount!: number;
  @IsInt() @Min(0) meteringCount!: number;
  @IsString() submitTime!: string;
  @IsOptional() @IsString() sendTime?: string;
  @IsString() content!: string;
}

class UpdateHomeTaskDto {
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() @IsString() customerAccount?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsInt() @Min(0) reportCount?: number;
  @IsOptional() @IsInt() @Min(0) meteringCount?: number;
  @IsOptional() @IsString() submitTime?: string;
  @IsOptional() @IsString() sendTime?: string;
  @IsOptional() @IsString() content?: string;
}

@Controller("home-tasks")
export class HomeTasksController {
  constructor(private readonly service: HomeTasksService) {}

  @Get()
  list(@Query("username") username?: string) {
    return this.service.list(username);
  }

  @Post()
  create(@Body() body: HomeTaskDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateHomeTaskDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

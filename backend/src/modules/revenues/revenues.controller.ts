import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsNumber, IsString, Max, Min } from "class-validator";
import { RevenuesService } from "./revenues.service";

class UpsertPointDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRatePercent!: number;
}

class ScanRevenueDto {
  @IsString()
  pointName!: string;
}

@Controller("revenues")
export class RevenuesController {
  constructor(private readonly service: RevenuesService) {}

  @Get("points")
  listPoints() {
    return this.service.listPoints();
  }

  @Put("points/:pointName")
  upsertPoint(@Param("pointName") pointName: string, @Body() body: UpsertPointDto) {
    return this.service.upsertPoint(pointName, body.commissionRatePercent);
  }

  @Get("records")
  listRecords(@Query("pointName") pointName?: string) {
    return this.service.listRecords(pointName);
  }

  @Post("scan")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    })
  )
  scanRevenue(
    @UploadedFile() file: { buffer: Buffer } | undefined,
    @Body() body: ScanRevenueDto
  ) {
    if (!file) {
      throw new BadRequestException("请上传二维码图片（file）");
    }
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("上传图片为空");
    }
    return this.service.scanAndCreateRecord(body.pointName, file.buffer);
  }
}

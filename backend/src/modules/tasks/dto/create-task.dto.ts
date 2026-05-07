import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  taskName!: string;

  @IsString()
  customerCode!: string;

  @IsString()
  content!: string;

  @IsIn(["sms", "internal"])
  channel!: "sms" | "internal";

  @IsOptional()
  @IsString()
  scheduleTime?: string;
}

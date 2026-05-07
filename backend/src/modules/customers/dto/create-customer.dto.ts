import { IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  customerCode!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

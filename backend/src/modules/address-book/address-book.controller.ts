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
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AddressBookService } from "./address-book.service";

class ContactDto {
  @IsString() username!: string;
  @IsOptional() @IsString() name?: string;
  @IsString() phone!: string;
  @IsOptional() @IsString() groupName?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() op?: string;
}

class UpdateContactDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() groupName?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() op?: string;
}

class BulkItemDto {
  @IsOptional() @IsString() name?: string;
  @IsString() phone!: string;
  @IsOptional() @IsString() groupName?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() op?: string;
}

class BulkCreateDto {
  @IsString() username!: string;
  @IsOptional() @IsBoolean() replace?: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkItemDto)
  items!: BulkItemDto[];
}

@Controller("address-book")
export class AddressBookController {
  constructor(private readonly service: AddressBookService) {}

  @Get()
  list(@Query("username") username?: string) {
    return this.service.list(username);
  }

  @Post()
  create(@Body() body: ContactDto) {
    return this.service.create(body);
  }

  @Post("bulk")
  bulk(@Body() body: BulkCreateDto) {
    return this.service.bulkCreate({
      username: body.username,
      replace: Boolean(body.replace),
      items: body.items.map((item) => ({
        username: body.username,
        name: item.name,
        phone: item.phone,
        groupName: item.groupName,
        tags: item.tags,
        op: item.op
      }))
    });
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateContactDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Delete("user/:username")
  clear(@Param("username") username: string) {
    return this.service.clear(username);
  }
}

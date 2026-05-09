import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressBookEntity } from "./address-book.entity";
import { AddressBookController } from "./address-book.controller";
import { AddressBookService } from "./address-book.service";

@Module({
  imports: [TypeOrmModule.forFeature([AddressBookEntity])],
  controllers: [AddressBookController],
  providers: [AddressBookService]
})
export class AddressBookModule {}

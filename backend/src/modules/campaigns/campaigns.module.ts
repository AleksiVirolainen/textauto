import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressBookEntity } from "../address-book/address-book.entity";
import { CampaignEntity } from "./campaign.entity";
import { CampaignItemEntity } from "./campaign-item.entity";
import { CampaignsController } from "./campaigns.controller";
import { CampaignsService } from "./campaigns.service";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity, CampaignItemEntity, AddressBookEntity])],
  controllers: [CampaignsController],
  providers: [CampaignsService]
})
export class CampaignsModule {}

import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { HealthModule } from "./modules/health/health.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { BalancesModule } from "./modules/balances/balances.module";
import { HomeTasksModule } from "./modules/home-tasks/home-tasks.module";
import { AddressBookModule } from "./modules/address-book/address-book.module";
import { CampaignsModule } from "./modules/campaigns/campaigns.module";
import { RevenuesModule } from "./modules/revenues/revenues.module";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    CustomersModule,
    TasksModule,
    BalancesModule,
    HomeTasksModule,
    AddressBookModule,
    CampaignsModule,
    RevenuesModule,
    HealthModule
  ]
})
export class AppModule {}

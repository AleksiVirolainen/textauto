import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { HealthModule } from "./modules/health/health.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [DatabaseModule, AuthModule, CustomersModule, TasksModule, HealthModule]
})
export class AppModule {}

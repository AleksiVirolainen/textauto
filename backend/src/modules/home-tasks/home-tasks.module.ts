import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomeTaskEntity } from "./home-task.entity";
import { HomeTasksController } from "./home-tasks.controller";
import { HomeTasksService } from "./home-tasks.service";

@Module({
  imports: [TypeOrmModule.forFeature([HomeTaskEntity])],
  controllers: [HomeTasksController],
  providers: [HomeTasksService]
})
export class HomeTasksModule {}

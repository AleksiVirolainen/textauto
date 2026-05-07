import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskEntity } from "./task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>
  ) {}

  list() {
    return this.taskRepo.find({ order: { id: "DESC" } });
  }

  create(dto: CreateTaskDto) {
    const entity = this.taskRepo.create({
      taskName: dto.taskName,
      customerCode: dto.customerCode,
      content: dto.content,
      channel: dto.channel,
      scheduleTime: dto.scheduleTime ?? null,
      status: "pending"
    });
    return this.taskRepo.save(entity);
  }
}

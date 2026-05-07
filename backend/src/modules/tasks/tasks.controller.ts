import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list() {
    return this.tasksService.list();
  }

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }
}

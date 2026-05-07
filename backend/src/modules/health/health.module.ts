import { Controller, Get, Module } from "@nestjs/common";

@Controller()
class HealthController {
  @Get()
  root() {
    return { status: "ok", service: "textauto-api" };
  }

  @Get("health")
  health() {
    return { status: "ok" };
  }
}

@Module({
  controllers: [HealthController]
})
export class HealthModule {}

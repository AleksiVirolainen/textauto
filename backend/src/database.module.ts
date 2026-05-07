import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { mkdirSync } from "fs";
import { join } from "path";

function buildOptions(): TypeOrmModuleOptions {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return {
      type: "postgres",
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true
    };
  }

  const dataDir = join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });

  return {
    type: "better-sqlite3",
    database: join(dataDir, "local.sqlite"),
    autoLoadEntities: true,
    synchronize: true
  };
}

@Module({
  imports: [TypeOrmModule.forRoot(buildOptions())]
})
export class DatabaseModule {}

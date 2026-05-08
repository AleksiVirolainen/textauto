import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

function buildOptions(): TypeOrmModuleOptions {
  const databaseUrl = process.env.DATABASE_URL;
  const useSsl = process.env.DB_SSL === "true";

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Set it to your PostgreSQL connection string.");
  }

  return {
    type: "postgres",
    url: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    synchronize: true
  };
}

@Module({
  imports: [TypeOrmModule.forRoot(buildOptions())]
})
export class DatabaseModule {}

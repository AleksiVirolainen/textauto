import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export type CampaignStatus = "running" | "paused" | "done" | "canceled";

@Entity("ab_campaigns")
export class CampaignEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: "varchar", length: 64 })
  username!: string;

  @Column({ type: "varchar", length: 128, default: "" })
  title!: string;

  @Column({ name: "rate_min", type: "int", default: 2 })
  ratePerHourMin!: number;

  @Column({ name: "rate_max", type: "int", default: 3 })
  ratePerHourMax!: number;

  @Column({ name: "work_hour_start", type: "int", default: 9 })
  workHourStart!: number;

  @Column({ name: "work_hour_end", type: "int", default: 22 })
  workHourEnd!: number;

  @Column({ name: "default_group", type: "varchar", length: 64, default: "" })
  defaultGroupName!: string;

  @Column({ name: "default_tags", type: "varchar", length: 64, default: "" })
  defaultTags!: string;

  @Column({ name: "default_op", type: "varchar", length: 64, default: "" })
  defaultOp!: string;

  @Column({ type: "varchar", length: 16, default: "running" })
  status!: CampaignStatus;

  @Column({ name: "total_count", type: "int", default: 0 })
  totalCount!: number;

  @Column({ name: "inserted_count", type: "int", default: 0 })
  insertedCount!: number;

  @Column({ name: "failed_count", type: "int", default: 0 })
  failedCount!: number;

  @Column({ name: "last_inserted_at", type: "timestamptz", nullable: true })
  lastInsertedAt!: Date | null;

  @Column({ name: "next_scheduled_at", type: "timestamptz", nullable: true })
  nextScheduledAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

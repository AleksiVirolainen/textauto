import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "task_name", type: "varchar", length: 128 })
  taskName!: string;

  @Column({ name: "customer_code", type: "varchar", length: 64 })
  customerCode!: string;

  @Column({ type: "varchar", length: 32, default: "sms" })
  channel!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "varchar", length: 32, default: "pending" })
  status!: string;

  @Column({ name: "schedule_time", type: "varchar", length: 64, nullable: true })
  scheduleTime?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

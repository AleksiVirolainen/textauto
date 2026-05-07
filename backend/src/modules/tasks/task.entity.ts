import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "task_name" })
  taskName!: string;

  @Column({ name: "customer_code" })
  customerCode!: string;

  @Column({ default: "sms" })
  channel!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ default: "pending" })
  status!: string;

  @Column({ name: "schedule_time", nullable: true })
  scheduleTime?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

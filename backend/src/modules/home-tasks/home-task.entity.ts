import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("home_tasks")
export class HomeTaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: "varchar", length: 64 })
  username!: string;

  @Column({ name: "task_id", type: "varchar", length: 64 })
  taskId!: string;

  @Column({ name: "customer_account", type: "varchar", length: 64 })
  customerAccount!: string;

  @Column({ type: "varchar", length: 32, default: "成功" })
  status!: string;

  @Column({ name: "report_count", type: "int", default: 0 })
  reportCount!: number;

  @Column({ name: "metering_count", type: "int", default: 0 })
  meteringCount!: number;

  @Column({ name: "submit_time", type: "varchar", length: 64, default: "" })
  submitTime!: string;

  @Column({ name: "send_time", type: "varchar", length: 64, default: "-" })
  sendTime!: string;

  @Column({ type: "text", default: "" })
  content!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

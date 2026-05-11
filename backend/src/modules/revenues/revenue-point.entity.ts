import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("revenue_points")
export class RevenuePointEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: "point_name", type: "varchar", length: 64 })
  pointName!: string;

  // 抽成比例，按基点保存（10000 = 100%）
  @Column({ name: "commission_rate_bps", type: "int", default: 0 })
  commissionRateBps!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

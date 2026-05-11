import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("revenue_records")
export class RevenueRecordEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ name: "point_name", type: "varchar", length: 64 })
  pointName!: string;

  // 本次收款金额（分）
  @Column({ name: "amount_cents", type: "int" })
  amountCents!: number;

  // 抽成比例（基点）
  @Column({ name: "commission_rate_bps", type: "int" })
  commissionRateBps!: number;

  // 抽成金额（分）
  @Column({ name: "commission_cents", type: "int" })
  commissionCents!: number;

  // 到手金额（分）
  @Column({ name: "net_amount_cents", type: "int" })
  netAmountCents!: number;

  @Column({ name: "qr_payload", type: "text" })
  qrPayload!: string;

  @Column({ name: "detect_strategy", type: "varchar", length: 64 })
  detectStrategy!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

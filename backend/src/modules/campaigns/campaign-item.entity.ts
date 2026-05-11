import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export type CampaignItemStatus = "pending" | "inserted" | "failed";

@Entity("ab_campaign_items")
export class CampaignItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ name: "campaign_id", type: "int" })
  campaignId!: number;

  @Column({ type: "varchar", length: 32 })
  phone!: string;

  @Column({ type: "varchar", length: 64, default: "" })
  tags!: string;

  @Column({ name: "group_name", type: "varchar", length: 64, default: "" })
  groupName!: string;

  @Column({ type: "varchar", length: 64, default: "" })
  op!: string;

  @Column({ type: "varchar", length: 16, default: "pending" })
  status!: CampaignItemStatus;

  @Column({ name: "inserted_at", type: "timestamptz", nullable: true })
  insertedAt!: Date | null;

  @Column({ name: "fail_reason", type: "varchar", length: 256, default: "" })
  failReason!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

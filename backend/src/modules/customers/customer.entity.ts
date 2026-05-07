import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "customer_code", type: "varchar", length: 64, unique: true })
  customerCode!: string;

  @Column({ type: "varchar", length: 128 })
  name!: string;

  @Column({ name: "contact_phone", type: "varchar", length: 32, nullable: true })
  contactPhone?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

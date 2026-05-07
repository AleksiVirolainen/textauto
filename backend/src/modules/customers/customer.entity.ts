import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "customer_code", unique: true })
  customerCode!: string;

  @Column()
  name!: string;

  @Column({ name: "contact_phone", nullable: true })
  contactPhone?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

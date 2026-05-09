import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("address_book")
export class AddressBookEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: "varchar", length: 64 })
  username!: string;

  @Column({ type: "varchar", length: 128, default: "" })
  name!: string;

  @Column({ type: "varchar", length: 32, default: "" })
  phone!: string;

  @Column({ name: "group_name", type: "varchar", length: 64, default: "" })
  groupName!: string;

  @Column({ type: "varchar", length: 64, default: "" })
  tags!: string;

  @Column({ type: "varchar", length: 64, default: "" })
  op!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

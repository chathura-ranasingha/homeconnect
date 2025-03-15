import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Lead } from "./Lead";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Lead, (lead) => lead.sale, { onDelete: "CASCADE" })
  @JoinColumn()
  lead!: Lead;

  @Column({ type: "date" })
  saleDate!: Date;

  @Column({ type: "decimal" })
  finalSalePrice!: number;

  @Column({ type: "text", nullable: true })
  commissionDetails!: string;
}

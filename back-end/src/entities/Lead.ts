import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { Property } from "./Property";
import { Reservation } from "./Reservation";
import { Sale } from "./Sale";

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number | string;

  // @Column({ unique: true })
  // username!: string;

  @Column()
  name!: string;

  @Column()
  contactInfo!: string;

  @Column({
    type: "enum",
    enum: [
      "Zillow",
      "Realtor.com",
      "Google Ads",
      "Facebook Ads",
      "Landing Page",
    ],
  })
  source!: string;

  @Column({ type: "date" })
  inquiryDate!: Date;

  @Column({
    type: "enum",
    enum: [
      "Unassigned",
      "Assigned",
      "Reservation",
      "Financials Approved",
      "Legal Finalized",
      "Sold",
      "Cancelled",
    ],
    default: "Unassigned",
  })
  status!: string;

  @ManyToOne(() => User, (user) => user.leads, {
    nullable: true,
    onDelete: "SET NULL",
  })
  assignedAgent!: User;

  @Column({ nullable: true })
  followUpStatus!: string;

  @Column({ nullable: true })
  preferredPropertyType!: string;

  @Column({ type: "decimal", nullable: true })
  budget!: number;

  @Column({ type: "text", nullable: true })
  notes!: string;

  @OneToOne(() => Reservation, (reservation) => reservation.lead)
  reservation!: Reservation;

  @OneToOne(() => Sale, (sale) => sale.lead)
  sale!: Sale;
}

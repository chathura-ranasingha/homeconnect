import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Lead } from "./Lead";
import { Property } from "./Property";
import { User } from "./User"; // Assuming you have a User entity

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.id) // Linking to the User entity
  @JoinColumn({ name: "userId" })
  user!: User; // This replaces `username`

  @OneToOne(() => Lead, (lead) => lead.reservation, { onDelete: "CASCADE" })
  @JoinColumn()
  lead!: Lead;

  @ManyToOne(() => Property, (property) => property.reservations)
  property!: Property;

  @Column({ type: "date" })
  reservationDate!: Date;

  @Column({ type: "decimal", nullable: true })
  reservationFee!: number;

  @Column({ type: "date", nullable: true })
  expectedClosingDate!: Date;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Cancelled"],
    default: "Pending",
  })
  financialStatus!: string;

  @Column({ type: "decimal", nullable: true })
  loanAmount!: number;

  @Column({ nullable: true })
  paymentPlan!: string;

  @Column({ nullable: true })
  contractSigned!: boolean;

  @Column({ nullable: true })
  legalNotes!: string;
}

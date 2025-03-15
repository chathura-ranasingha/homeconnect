import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  location!: string;

  @Column({ type: "decimal" })
  price!: number;

  @Column({
    type: "enum",
    enum: ["Available", "Reserved", "Sold"],
    default: "Available",
  })
  status!: string;

  @OneToMany(() => Reservation, (reservation) => reservation.property)
  reservations!: Reservation[];
}

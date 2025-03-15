import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lead } from "./Lead";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "agent"] })
  role!: "admin" | "agent";

  @OneToMany(() => Lead, (lead) => lead.assignedAgent)
  leads!: Lead[];
}

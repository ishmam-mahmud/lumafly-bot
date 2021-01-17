import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Guild } from "./Guild"
import { Role } from "./Role";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Guild, guild => guild.categories)
  guild: Guild;

  @OneToMany(() => Role, role => role.category, {
    eager: true,
  })
  roles: Role[];

  @Column({
    default: "DEFAULT",
  })
  defaultRoleColor: string;

  @Column()
  selfAssignable: boolean;

}
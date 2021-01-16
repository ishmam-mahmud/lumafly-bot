import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Role } from "./Role";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Role, role => role.category)
  roles: Role[];

  @Column({
    nullable: true,
  })
  defaultRoleColor: string;

  @Column()
  selfAssignable: boolean;

}
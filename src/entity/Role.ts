import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Category } from "./Category"

@Entity()
export class Role {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, category => category.roles)
  category: Category;
}
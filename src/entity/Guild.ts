import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { Category } from "./Category";

@Entity()
export class Guild {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Category, category => category.guild)
  categories: Category[];

  @Column("simple-json")
  config: GuildConfig;
}

type GuildConfig = {
  suggestionsChannelID: string;
}
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne
} from "typeorm";
import { Genre } from "../genre/genre.entity";
import { Author } from "../author/author.entity";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 500 })
  title: string;

  @ManyToOne(type => Author, { cascade: ["insert", "update"] })
  author: Author;

  @ManyToMany(type => Genre, { cascade: ["insert", "update"], eager: true })
  @JoinTable()
  genre: Genre[];

  @Column()
  ageGroup: string;

  @CreateDateColumn()
  creation: string;

  @UpdateDateColumn()
  modified: string;
}

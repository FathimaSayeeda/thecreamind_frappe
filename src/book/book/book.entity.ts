import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Genre } from "../genre/genre.entity";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 200 })
  author: string;

  @ManyToMany(type => Genre, { cascade: true, eager: true })
  @JoinTable()
  genre: Genre[];

  @Column()
  ageGroup: string;

  @CreateDateColumn()
  creation: string;

  @UpdateDateColumn()
  modified: string;
}

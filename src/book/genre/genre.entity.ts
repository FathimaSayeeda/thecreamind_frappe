import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Genre {
  @PrimaryColumn()
  type: string;
}

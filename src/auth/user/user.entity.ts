import { Entity, Column, PrimaryColumn, Generated } from "typeorm";

@Entity()
export class User {
  @Generated("uuid")
  @Column({ unique: true })
  id: string;

  @PrimaryColumn()
  email: string;

  @Column()
  firstName: string;

  @Column({ select: false })
  passwordDigest: string;
}

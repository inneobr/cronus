import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "ADMIN", name: "CIDADE" })
export class Cidade {
  @PrimaryGeneratedColumn({ name: "ID", type: "number" })
  id!: number;

  @Column({ name: "DESCRICAO", type: "varchar2", length: 255 })
  descricao!: string;
}
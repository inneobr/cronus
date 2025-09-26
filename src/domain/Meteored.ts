import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from '@/domain/Cidade.js';


@Entity({ schema: 'WEATHER', name: 'METEORED' })
export class Meteored {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: "DATE", type: "varchar", length: 10 })
  date?: string;

  @Column({ name: "NAME", type: "varchar", length: 10, nullable: true })
  name?: string;

  @Column({ name: "ICON", type: "varchar", length: 80, nullable: true })
  icon?: string;

  @Column({ name: "DESC", type: "varchar", length: 20, nullable: true })
  desc?: string;

  @Column({ name: "TEMP", type: "varchar", length: 3, nullable: true })
  temp?: string;

  @Column({ name: "SENS", type: "varchar", length: 3, nullable: true })
  sens?: string;

  @Column({ name: "TMAX", type: "varchar", length: 3, nullable: true })
  tmax?: string;

  @Column({ name: "TMIN", type: "varchar", length: 3, nullable: true })
  tmin?: string;

  @Column({ name: "WIND", type: "varchar", length: 15, nullable: true })
  wind?: string;

  @Column({ name: "RAIN", type: "varchar", length: 20, nullable: true })
  rain?: string;

  @Column({ name: "PROV", type: "varchar", length: 20, nullable: true })
  prov?: string;

  @Column({ name: 'CIDADE', type: 'number' })
  cidadeId?: number;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'CIDADE', referencedColumnName: 'id' })
  cidade?: Cidade;

  @CreateDateColumn({ name: "PUBLISH", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  publish?: Date;
}
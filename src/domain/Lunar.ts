import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinColumn } from 'typeorm';
import { Meteored } from './Meteored.js';

@Entity({ name: 'LUNAR' })
export class Lunar {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: "DAY", type: "varchar", length: 10 })
  day?: string;

  @Column({ name: "NAME", type: "varchar", length: 30, nullable: true })
  name?: string;

  @Column({ name: "ICON", type: "varchar", length: 80, nullable: true })
  icon?: string;

  @Column({ name: "PERC", type: "varchar", length: 10, nullable: true })
  perc?: string;
}
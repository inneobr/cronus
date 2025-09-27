import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from '@/domain/Cidade.js';

@Entity({ schema: 'WEATHER', name: 'METHOUR' })
export class Methour {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;  

  @Column({ name: 'HORA', type: 'varchar', length: 5 })
  hora!: string;

  @Column({ name: "DATE", type: "varchar", length: 10 })
  date?: string;

  @Column({ name: 'TEMP', type: 'varchar', length: 10, nullable: true })
  temp?: string;

  @Column({ name: 'SENS', type: 'varchar', length: 10, nullable: true })
  sens?: string;

  @Column({ name: 'RAIN', type: 'varchar', length: 10, nullable: true })
  rain?: string;

  @Column({ name: "PROV", type: "varchar", length: 20, nullable: true })
  prov?: string;

  @Column({ name: "CLOD", type: "varchar", length: 20, nullable: true })
  clod?: string;

  @Column({ name: "FOGS", type: "varchar", length: 20, nullable: true })
  fogs?: string;

  @Column({ name: "VISB", type: "varchar", length: 20, nullable: true })
  visb?: string;

  @Column({ name: "DEWS", type: "varchar", length: 20, nullable: true })
  dews?: string;

  @Column({ name: 'UMID', type: 'varchar', length: 10, nullable: true })
  umid?: string;

  @Column({ name: 'DESC', type: 'varchar', length: 100, nullable: true })
  desc?: string;

  @Column({ name: 'WIND', type: 'varchar', length: 20, nullable: true })
  wind?: string;

  @Column({ name: 'BURS', type: 'varchar', length: 20, nullable: true })
  burs?: string;  

  @Column({ name: 'PRES', type: 'varchar', length: 20, nullable: true })
  pres?: string;

  @Column({ name: 'IFPS', type: 'varchar', length: 20, nullable: true })
  ifps?: string;

  @Column({ name: 'ICON', type: 'varchar', length: 255, nullable: true })
  icon?: string;

  @Column({ name: 'CIDADE', type: 'number' })
  cidadeId?: number;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'CIDADE', referencedColumnName: 'id' })
  cidade?: Cidade;

 @CreateDateColumn({ name: "PUBLISH", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  publish?: Date;
}
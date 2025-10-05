import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from '@/domain/Cidade.js';

@Entity({ schema: 'WEATHER', name: 'TODAY' })
export class Today {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'INDI', type: 'varchar', length: 10, unique: true })
  indi!: string;

  @Column({ name: 'DESC', type: 'varchar', length: 80, nullable: true })
  desc?: string;

  @Column({ name: 'VALU', type: 'varchar', length: 80, nullable: true })
  valu?: string;

  @Column({ name: 'INFO', type: 'varchar', length: 255, nullable: true })
  info?: string;

  @Column({ name: 'PLUZ', type: 'varchar', length: 5, nullable: true })
  pluz?: string;

  @Column({ name: 'NSUN', type: 'varchar', length: 5, nullable: true })
  nsun?: string;

  @Column({ name: 'MDAY', type: 'varchar', length: 5, nullable: true })
  mday?: string;

  @Column({ name: 'PSUN', type: 'varchar', length: 5, nullable: true })
  psun?: string;

  @Column({ name: 'ULUZ', type: 'varchar', length: 5, nullable: true })
  uluz?: string;

  @Column({ name: 'CIDADE', type: 'number', nullable: true })
  cidadeId?: number;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'CIDADE', referencedColumnName: 'id' })
  cidade?: Cidade;

  @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publish?: Date;
}
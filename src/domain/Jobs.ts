import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from '@/domain/Cidade.js';

@Entity({ schema: 'INFORMATIVE', name: 'JOBS' })
export class Job {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'NAME', type: 'varchar', length: 80, unique: true })
  name!: string;

  @Column({ name: 'AMOUNT', type: 'varchar', length: 5, nullable: true })
  amount?: string;

  @Column({ name: 'DETAILS', type: 'varchar', length: 5000, nullable: true })
  details?: string;

  @Column({ name: 'CIDADE', type: 'number', nullable: true })
  cidadeId?: number;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'CIDADE', referencedColumnName: 'id' })
  cidade?: Cidade;

  @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publish?: Date;
}
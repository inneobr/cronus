import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from '@/domain/Cidade.js';

@Entity({ schema: 'INFORMATIVE', name: 'PREFEITURA' })
export class Prefeitura {
    @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
    id!: number;

    @Column({ name: 'URI', type: 'varchar', length: 300, unique: true })
    uri!: string;

    @Column({ name: 'TITLE', type: 'varchar', length: 200, nullable: true })
    title?: string;

    @Column({ name: 'DESCRICAO', type: 'clob', nullable: true })
    descricao?: string;

    @Column({ name: 'THUMBNAIL', type: 'varchar', length: 300, nullable: true })
    thumbnail?: string;

    @Column({ name: 'CIDADE', type: 'number' })
    cidadeId?: number;

    @ManyToOne(() => Cidade)
    @JoinColumn({ name: 'CIDADE', referencedColumnName: 'id' })
    cidade?: Cidade;

    @CreateDateColumn({ name: "PUBLISH", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    publish?: Date;
}
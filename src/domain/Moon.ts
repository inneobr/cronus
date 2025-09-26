import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity({ schema: 'WEATHER', name: 'MOON' })
export class Moon {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: "DATE", type: "varchar", length: 10 })
  date?: string;

  @Column({ name: "NAME", type: "varchar", length: 30, nullable: true })
  name?: string;

  @Column({ name: "ICON", type: "varchar", length: 80, nullable: true })
  icon?: string;

  @CreateDateColumn({ name: "PUBLISH", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  publish?: Date;
}
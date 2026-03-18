import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class CodingLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ default: 0 })
    minutes: number;

    @Column({ nullable: true })
    language: string;

    @CreateDateColumn()
    createdAt: Date;
}

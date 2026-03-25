import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Reminder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    date: string; // ISO string for date/time

    @Column({ default: false })
    isNotified: boolean;

    @CreateDateColumn()
    createdAt: Date;
}

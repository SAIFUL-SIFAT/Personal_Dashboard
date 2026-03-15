import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'TODO' })
    status: string;

    @Column({ default: 'MEDIUM' })
    priority: string;

    @Column({ nullable: true })
    duration: string;

    @Column({ default: 'personal' })
    category: string;

    @Column({ nullable: true })
    tags: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

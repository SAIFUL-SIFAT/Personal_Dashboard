import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Workout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    muscleGroup: string; // Chest, Biceps, etc.

    @Column({ default: 0 })
    count: number; // Reps or sets count

    @Column({ nullable: true })
    exerciseName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

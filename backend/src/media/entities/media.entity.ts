import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    type: string; // MOVIE, ANIME, MUSIC, SERIES

    @Column({ default: 0 })
    progress: number;

    @Column({ nullable: true })
    season: number;

    @Column({ nullable: true })
    episode: number;

    @Column({ nullable: true })
    rating: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    status: string; // WATCHING, COMPLETED, DROPPED

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit, HabitLog } from './entities/habit.entity';
import { Workout } from './entities/workout.entity';

@Injectable()
export class HabitsService {
    constructor(
        @InjectRepository(Habit)
        private habitsRepository: Repository<Habit>,
        @InjectRepository(HabitLog)
        private logsRepository: Repository<HabitLog>,
        @InjectRepository(Workout)
        private workoutRepository: Repository<Workout>,
    ) { }

    findAll() {
        return this.habitsRepository.find({ relations: ['logs'] });
    }

    findAllWorkouts() {
        return this.workoutRepository.find({ order: { date: 'DESC' } });
    }

    async getWorkoutSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const workouts = await this.workoutRepository.find();
        // Filter for today in summary
        return workouts.filter(w => new Date(w.date) >= today).reduce((acc: { [key: string]: number }, w) => {
            acc[w.muscleGroup] = (acc[w.muscleGroup] || 0) + (w.count || 0);
            return acc;
        }, {});
    }


    async getWorkoutTrend() {
        const workouts = await this.workoutRepository.find({ order: { date: 'ASC' } });
        // Group by date and muscle group
        return workouts.reduce((acc: any, w) => {
            const dateStr = new Date(w.date).toISOString().split('T')[0];
            if (!acc[dateStr]) acc[dateStr] = {};
            acc[dateStr][w.muscleGroup] = (acc[dateStr][w.muscleGroup] || 0) + (w.count || 0);
            return acc;
        }, {});
    }


    createWorkout(data: Partial<Workout>) {
        const workout = this.workoutRepository.create(data);
        return this.workoutRepository.save(workout);
    }

    create(data: Partial<Habit>) {
        const habit = this.habitsRepository.create(data);
        return this.habitsRepository.save(habit);
    }

    async logProgress(id: string) {
        const habit = await this.habitsRepository.findOne({ where: { id } });
        if (!habit) return null;

        const log = this.logsRepository.create({ habit });
        await this.logsRepository.save(log);

        habit.progress = (habit.progress || 0) + 1;
        return this.habitsRepository.save(habit);
    }
}

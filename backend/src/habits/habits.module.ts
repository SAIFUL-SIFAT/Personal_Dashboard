import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitLog } from './entities/habit.entity';
import { Workout } from './entities/workout.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Habit, HabitLog, Workout])],
    controllers: [HabitsController],
    providers: [HabitsService],
})
export class HabitsModule { }

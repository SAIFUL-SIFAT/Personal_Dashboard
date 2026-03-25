import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Task } from '../tasks/entities/task.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Workout } from '../habits/entities/workout.entity';
import { CodingLog } from '../coding/entities/coding.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, Expense, Workout, CodingLog]),
    ],
    controllers: [AiController],
    providers: [AiService],
    exports: [AiService],
})
export class AiModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { HabitsModule } from './habits/habits.module';
import { ExpensesModule } from './expenses/expenses.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VaultModule } from './vault/vault.module';
import { CodingModule } from './coding/coding.module';
import { RemindersModule } from './reminders/reminders.module';
import { AiModule } from './ai/ai.module';

import { Task } from './tasks/entities/task.entity';
import { Habit, HabitLog } from './habits/entities/habit.entity';
import { Workout } from './habits/entities/workout.entity';
import { Expense } from './expenses/entities/expense.entity';
import { Media } from './media/entities/media.entity';
import { User } from './users/entities/user.entity';
import { VaultItem } from './vault/entities/vault.entity';
import { CodingLog } from './coding/entities/coding.entity';
import { Reminder } from './reminders/entities/reminder.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Task, Habit, HabitLog, Workout, Expense, Media, User, VaultItem, CodingLog, Reminder],

        synchronize: true, // DEV ONLY
      }),
    }),
    TasksModule,
    HabitsModule,
    ExpensesModule,
    MediaModule,
    AuthModule,
    UsersModule,
    VaultModule,
    CodingModule,
    RemindersModule,
    AiModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

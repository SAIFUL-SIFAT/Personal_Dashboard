import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
    constructor(private readonly habitsService: HabitsService) { }

    @Get()
    findAll() {
        return this.habitsService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.habitsService.create(body);
    }

    @Post(':id/log')
    log(@Param('id') id: string) {
        return this.habitsService.logProgress(id);
    }

    @Get('workouts/summary')
    getWorkoutSummary() {
        return this.habitsService.getWorkoutSummary();
    }

    @Get('workouts/trend')
    getWorkoutTrend() {
        return this.habitsService.getWorkoutTrend();
    }

    @Get('workouts')
    findAllWorkouts() {
        return this.habitsService.findAllWorkouts();
    }


    @Post('workouts')
    createWorkout(@Body() body: any) {
        return this.habitsService.createWorkout(body);
    }
}

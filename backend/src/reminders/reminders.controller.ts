import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { Reminder } from './entities/reminder.entity';

@Controller('reminders')
export class RemindersController {
    constructor(private readonly remindersService: RemindersService) { }

    @Post()
    create(@Body() data: Partial<Reminder>) {
        return this.remindersService.create(data);
    }

    @Get()
    findAll() {
        return this.remindersService.findAll();
    }

    @Get('due')
    findDue() {
        return this.remindersService.findDueReminders();
    }

    @Patch(':id/notified')
    markNotified(@Param('id') id: string) {
        return this.remindersService.markAsNotified(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.remindersService.remove(id);
    }
}

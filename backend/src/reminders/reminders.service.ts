import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class RemindersService {
    constructor(
        @InjectRepository(Reminder)
        private remindersRepository: Repository<Reminder>,
    ) { }

    async create(data: Partial<Reminder>): Promise<Reminder> {
        const reminder = this.remindersRepository.create(data);
        return this.remindersRepository.save(reminder);
    }

    async findAll(): Promise<Reminder[]> {
        return this.remindersRepository.find({ order: { date: 'ASC' } });
    }

    async findDueReminders(): Promise<Reminder[]> {
        const now = new Date().toISOString();
        return this.remindersRepository.find({
            where: {
                date: LessThanOrEqual(now),
                isNotified: false,
            },
        });
    }

    async markAsNotified(id: string): Promise<void> {
        await this.remindersRepository.update(id, { isNotified: true });
    }

    async remove(id: string): Promise<void> {
        await this.remindersRepository.delete(id);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CodingLog } from './entities/coding.entity';

@Injectable()
export class CodingService {
    constructor(
        @InjectRepository(CodingLog)
        private codingRepository: Repository<CodingLog>,
    ) { }

    async findAll() {
        return this.codingRepository.find({ order: { date: 'DESC' } });
    }

    async getHistory(days: number = 365) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const logs = await this.codingRepository.find({
            where: {
                date: Between(date.toISOString().split('T')[0], new Date().toISOString().split('T')[0])
            }
        });

        // Sum minutes by date
        const heatmap = logs.reduce((acc, log) => {
            acc[log.date] = (acc[log.date] || 0) + log.minutes;
            return acc;
        }, {} as Record<string, number>);

        return heatmap;
    }

    async log(data: { minutes: number; language?: string; date?: string }) {
        const date = data.date || new Date().toISOString().split('T')[0];
        let log = await this.codingRepository.findOneBy({ date });

        if (log) {
            log.minutes += data.minutes;
            return this.codingRepository.save(log);
        } else {
            log = this.codingRepository.create({ ...data, date });
            return this.codingRepository.save(log);
        }
    }
}

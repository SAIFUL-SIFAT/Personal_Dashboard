import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async findAll(q?: string): Promise<Task[]> {
        if (q) {
            return this.tasksRepository.find({
                where: { title: Like(`%${q}%`) },
                order: { createdAt: 'DESC' },
            });
        }
        return this.tasksRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: Partial<Task>): Promise<Task> {
        const task = this.tasksRepository.create({
            title: data.title,
            description: data.description,
            priority: data.priority,
            duration: data.duration,
            tags: data.tags, // Can improve into relations
        });
        return this.tasksRepository.save(task);
    }

    async update(id: string, data: Partial<Task>): Promise<Task> {
        await this.tasksRepository.update(id, data);
        const updatedTask = await this.tasksRepository.findOneBy({ id });
        if (!updatedTask) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return updatedTask;
    }

    async remove(id: string): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}

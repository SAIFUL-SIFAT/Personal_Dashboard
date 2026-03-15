import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expensesRepository: Repository<Expense>,
    ) { }

    findAll() {
        return this.expensesRepository.find({ order: { date: 'DESC' } });
    }

    create(data: Partial<Expense>) {
        const expense = this.expensesRepository.create(data);
        return this.expensesRepository.save(expense);
    }

    async update(id: string, data: Partial<Expense>) {
        await this.expensesRepository.update(id, data);
        const updated = await this.expensesRepository.findOneBy({ id });
        if (!updated) throw new NotFoundException(`Expense #${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const expense = await this.expensesRepository.findOneBy({ id });
        if (!expense) throw new NotFoundException(`Expense #${id} not found`);
        return this.expensesRepository.remove(expense);
    }

    async getSummary() {
        const expenses = await this.expensesRepository.find();
        const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        const byCategory = expenses.reduce((acc: { [key: string]: number }, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
            return acc;
        }, {});
        return { total, byCategory };
    }
}

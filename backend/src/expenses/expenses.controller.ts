import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Get()
    findAll() {
        return this.expensesService.findAll();
    }

    @Get('summary')
    getSummary() {
        return this.expensesService.getSummary();
    }

    @Post()
    create(@Body() body: any) {
        return this.expensesService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.expensesService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.expensesService.remove(id);
    }
}

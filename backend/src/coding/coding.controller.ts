import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CodingService } from './coding.service';

@Controller('coding')
export class CodingController {
    constructor(private readonly codingService: CodingService) { }

    @Get()
    findAll() {
        return this.codingService.findAll();
    }

    @Get('history')
    getHistory(@Query('days') days?: string) {
        return this.codingService.getHistory(days ? parseInt(days) : 365);
    }

    @Post()
    log(@Body() body: { minutes: number; language?: string; date?: string }) {
        return this.codingService.log(body);
    }
}

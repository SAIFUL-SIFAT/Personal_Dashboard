import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { VaultService } from './vault.service';

@Controller('vault')
export class VaultController {
    constructor(private readonly vaultService: VaultService) { }

    @Get()
    findAll(@Query('q') q?: string) {
        return this.vaultService.findAll(q);
    }

    @Post()
    create(@Body() body: any) {
        return this.vaultService.create(body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vaultService.remove(id);
    }
}

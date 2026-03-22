import { Controller, Get, Post, Body, Query, Patch, Param, Delete } from '@nestjs/common';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get()
    findAll(@Query('type') type?: string) {
        return this.mediaService.findAll(type);
    }

    @Post()
    create(@Body() body: any) {
        return this.mediaService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.mediaService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.mediaService.remove(id);
    }
}


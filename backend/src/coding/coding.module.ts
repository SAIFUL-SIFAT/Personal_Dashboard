import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingLog } from './entities/coding.entity';
import { CodingService } from './coding.service';
import { CodingController } from './coding.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CodingLog])],
    providers: [CodingService],
    controllers: [CodingController],
    exports: [CodingService]
})
export class CodingModule { }

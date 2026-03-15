import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';
import { VaultItem } from './entities/vault.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VaultItem])],
    controllers: [VaultController],
    providers: [VaultService],
    exports: [VaultService],
})
export class VaultModule { }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { VaultItem } from './entities/vault.entity';

@Injectable()
export class VaultService {
    constructor(
        @InjectRepository(VaultItem)
        private vaultRepository: Repository<VaultItem>,
    ) { }

    findAll(search?: string) {
        if (search) {
            return this.vaultRepository.find({
                where: { title: Like(`%${search}%`) },
                order: { createdAt: 'DESC' }
            });
        }
        return this.vaultRepository.find({ order: { createdAt: 'DESC' } });
    }

    create(data: Partial<VaultItem>) {
        const item = this.vaultRepository.create(data);
        return this.vaultRepository.save(item);
    }

    remove(id: string) {
        return this.vaultRepository.delete(id);
    }
}

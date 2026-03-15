import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOneByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(email: string) {
        const user = this.usersRepository.create({ email });
        return this.usersRepository.save(user);
    }

    async createWithPassword(email: string, password: string, name?: string) {
        const user = this.usersRepository.create({ email, password, name });
        return this.usersRepository.save(user);
    }

    async update(id: string, data: Partial<User>) {
        return this.usersRepository.update(id, data);
    }
}

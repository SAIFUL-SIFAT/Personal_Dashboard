import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
    ) { }

    findAll(type?: string) {
        if (type) {
            return this.mediaRepository.find({ where: { type }, order: { createdAt: 'DESC' } });
        }
        return this.mediaRepository.find({ order: { createdAt: 'DESC' } });
    }

    create(data: Partial<Media>) {
        const item = this.mediaRepository.create(data);
        return this.mediaRepository.save(item);
    }

    async update(id: string, data: Partial<Media>) {
        await this.mediaRepository.update(id, data);
        return this.mediaRepository.findOne({ where: { id } });
    }

    remove(id: string) {
        return this.mediaRepository.delete(id);
    }
}


import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.entity';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  async all(relations = []): Promise<any[]> {
    return await this.repository.find({ relations });
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(condition, relations: any[] = []): Promise<any> {
    return this.repository.findOne(condition, { relations });
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }

  async paginate(page: number = 1, relations = []): Promise<PaginatedResult> {
    const take = 15;
    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
      order: {
        id: 'ASC',
      },
    });

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}

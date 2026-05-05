import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    try {
      const savedUser = await this.usersRepository.save(user);

      return this.normalizeUser(savedUser);
    } catch (error) {
      this.handleConstraintError(error, 'User email already exists.');
    }
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return users.map((user) => this.normalizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    return user ? this.normalizeUser(user) : null;
  }

  private normalizeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private handleConstraintError(error: unknown, message: string): never {
    if (error instanceof QueryFailedError) {
      const databaseError = error.driverError as { code?: string };

      if (databaseError.code === '23505') {
        throw new ConflictException(message);
      }
    }

    throw error;
  }
}

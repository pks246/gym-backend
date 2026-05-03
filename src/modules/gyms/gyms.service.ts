import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymDto } from './dto/create-gym.dto';
import { Gym } from './entities/gym.entity';

@Injectable()
export class GymsService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymsRepository: Repository<Gym>,
  ) {}

  async create(createGymDto: CreateGymDto) {
    const gym = this.gymsRepository.create({
      code: createGymDto.code,
      name: createGymDto.name,
      description: createGymDto.description,
      contactEmail: createGymDto.contactEmail,
      phoneNumber: createGymDto.phoneNumber,
      isActive: createGymDto.isActive ?? true,
      amenities:
        createGymDto.amenities?.map((amenity) => ({
          name: amenity.name,
          description: amenity.description,
        })) ?? [],
      operatingHours:
        createGymDto.operatingHours?.map((operatingHour) => ({
          dayOfWeek: operatingHour.dayOfWeek,
          openTime: operatingHour.openTime,
          closeTime: operatingHour.closeTime,
          isClosed: operatingHour.isClosed ?? false,
        })) ?? [],
    });

    const savedGym = await this.gymsRepository.save(gym);

    return this.normalizeGym(savedGym);
  }

  async findAll() {
    const gyms = await this.gymsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return gyms.map((gym) => this.normalizeGym(gym));
  }

  async findOne(id: number) {
    const gym = await this.gymsRepository.findOne({
      where: { id },
    });

    return gym ? this.normalizeGym(gym) : null;
  }

  private normalizeGym(gym: Gym) {
    return {
      ...gym,
      amenities: [...(gym.amenities ?? [])].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
      operatingHours: [...(gym.operatingHours ?? [])].sort(
        (left, right) => left.dayOfWeek - right.dayOfWeek,
      ),
    };
  }
}

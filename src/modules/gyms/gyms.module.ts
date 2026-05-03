import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymAmenity } from './entities/gym-amenity.entity';
import { GymOperatingHour } from './entities/gym-operating-hour.entity';
import { Gym } from './entities/gym.entity';
import { GymsController } from './gyms.controller';
import { GymsService } from './gyms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gym, GymAmenity, GymOperatingHour])],
  controllers: [GymsController],
  providers: [GymsService],
})
export class GymsModule {}

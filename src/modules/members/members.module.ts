import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from '../gyms/entities/gym.entity';
import { MemberEmergencyContact } from './entities/member-emergency-contact.entity';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberEmergencyContact, Gym])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gym } from '../gyms/entities/gym.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Gym)
    private readonly gymsRepository: Repository<Gym>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const gym = await this.gymsRepository.findOneBy({
      id: createMemberDto.gymId,
    });

    if (!gym) {
      throw new NotFoundException(
        `Gym with id ${createMemberDto.gymId} was not found.`,
      );
    }

    const member = this.membersRepository.create({
      gym,
      memberCode: createMemberDto.memberCode,
      firstName: createMemberDto.firstName,
      lastName: createMemberDto.lastName,
      email: createMemberDto.email,
      phoneNumber: createMemberDto.phoneNumber,
      dateOfBirth: createMemberDto.dateOfBirth,
      joinedOn: createMemberDto.joinedOn,
      status: createMemberDto.status ?? 'active',
      notes: createMemberDto.notes,
      emergencyContacts:
        createMemberDto.emergencyContacts?.map((contact) => ({
          name: contact.name,
          relationship: contact.relationship,
          phoneNumber: contact.phoneNumber,
        })) ?? [],
    });

    const savedMember = await this.membersRepository.save(member);

    return this.normalizeMember(savedMember);
  }

  async findAll() {
    const members = await this.membersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return members.map((member) => this.normalizeMember(member));
  }

  async findOne(id: number) {
    const member = await this.membersRepository.findOne({
      where: { id },
    });

    return member ? this.normalizeMember(member) : null;
  }

  private normalizeMember(member: Member) {
    return {
      ...member,
      emergencyContacts: [...(member.emergencyContacts ?? [])].sort(
        (left, right) => left.name.localeCompare(right.name),
      ),
    };
  }
}

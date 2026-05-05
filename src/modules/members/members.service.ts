import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

    if (
      createMemberDto.dateOfBirth &&
      createMemberDto.dateOfBirth > createMemberDto.joinedOn
    ) {
      throw new BadRequestException(
        'Member date of birth must be before the joined date.',
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

    let savedMember: Member;

    try {
      savedMember = await this.membersRepository.save(member);
    } catch (error) {
      this.handleConstraintError(error, 'Member code already exists.');
    }

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
      id: member.id,
      gym: {
        id: member.gym.id,
        code: member.gym.code,
        name: member.gym.name,
        isActive: member.gym.isActive,
      },
      memberCode: member.memberCode,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      dateOfBirth: member.dateOfBirth,
      joinedOn: member.joinedOn,
      status: member.status,
      notes: member.notes,
      emergencyContacts: [...(member.emergencyContacts ?? [])]
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((contact) => ({
          id: contact.id,
          name: contact.name,
          relationship: contact.relationship,
          phoneNumber: contact.phoneNumber,
        })),
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
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

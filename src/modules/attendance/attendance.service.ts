import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const member = await this.membersRepository.findOne({
      where: { id: createAttendanceDto.memberId },
    });

    if (!member) {
      throw new NotFoundException(
        `Member with id ${createAttendanceDto.memberId} was not found.`,
      );
    }

    if (member.status !== 'active') {
      throw new BadRequestException(
        'Attendance can only be recorded for active members.',
      );
    }

    if (
      createAttendanceDto.checkOutAt &&
      createAttendanceDto.checkOutAt < createAttendanceDto.checkInAt
    ) {
      throw new BadRequestException(
        'Attendance check-out time must be after the check-in time.',
      );
    }

    const attendance = this.attendanceRepository.create({
      member,
      attendedOn: createAttendanceDto.attendedOn,
      checkInAt: createAttendanceDto.checkInAt,
      checkOutAt: createAttendanceDto.checkOutAt,
      source: createAttendanceDto.source ?? 'front-desk',
      notes: createAttendanceDto.notes,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    return this.normalizeAttendance(savedAttendance);
  }

  async findAll() {
    const attendance = await this.attendanceRepository.find({
      order: {
        checkInAt: 'DESC',
      },
    });

    return attendance.map((entry) => this.normalizeAttendance(entry));
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    return attendance ? this.normalizeAttendance(attendance) : null;
  }

  private normalizeAttendance(attendance: Attendance) {
    return {
      id: attendance.id,
      member: {
        id: attendance.member.id,
        memberCode: attendance.member.memberCode,
        firstName: attendance.member.firstName,
        lastName: attendance.member.lastName,
        gym: {
          id: attendance.member.gym.id,
          code: attendance.member.gym.code,
          name: attendance.member.gym.name,
        },
      },
      attendedOn: attendance.attendedOn,
      checkInAt: attendance.checkInAt,
      checkOutAt: attendance.checkOutAt,
      source: attendance.source,
      notes: attendance.notes,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
    };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  const attendanceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const membersRepository = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: attendanceRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: membersRepository,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request attendance ordered by latest check in first', async () => {
    attendanceRepository.find.mockResolvedValue([]);

    await service.findAll();

    expect(attendanceRepository.find).toHaveBeenCalledWith({
      order: {
        checkInAt: 'DESC',
      },
    });
  });
});

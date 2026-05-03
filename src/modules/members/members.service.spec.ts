import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gym } from '../gyms/entities/gym.entity';
import { Member } from './entities/member.entity';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  const membersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };
  const gymsRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: membersRepository,
        },
        {
          provide: getRepositoryToken(Gym),
          useValue: gymsRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request members ordered by newest first', async () => {
    membersRepository.find.mockResolvedValue([]);

    await service.findAll();

    expect(membersRepository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });
  });
});

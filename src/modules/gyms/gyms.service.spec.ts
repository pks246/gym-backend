import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { GymsService } from './gyms.service';

describe('GymsService', () => {
  let service: GymsService;
  const gymsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymsService,
        {
          provide: getRepositoryToken(Gym),
          useValue: gymsRepository,
        },
      ],
    }).compile();

    service = module.get<GymsService>(GymsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request gyms ordered by newest first', async () => {
    gymsRepository.find.mockResolvedValue([]);

    await service.findAll();

    expect(gymsRepository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });
  });
});

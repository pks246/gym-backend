import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gym } from '../gyms/entities/gym.entity';
import { Member } from '../members/entities/member.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  const plansRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const subscriptionsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const gymsRepository = { findOneBy: jest.fn() };
  const membersRepository = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(SubscriptionPlan),
          useValue: plansRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: subscriptionsRepository,
        },
        { provide: getRepositoryToken(Gym), useValue: gymsRepository },
        { provide: getRepositoryToken(Member), useValue: membersRepository },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request subscription plans ordered by newest first', async () => {
    plansRepository.find.mockResolvedValue([]);

    await service.findAllPlans();

    expect(plansRepository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });
  });
});

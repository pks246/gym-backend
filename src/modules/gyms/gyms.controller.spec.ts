import { Test, TestingModule } from '@nestjs/testing';
import { GymsController } from './gyms.controller';
import { GymsService } from './gyms.service';

describe('GymsController', () => {
  let controller: GymsController;
  const gymsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymsController],
      providers: [
        {
          provide: GymsService,
          useValue: gymsService,
        },
      ],
    }).compile();

    controller = module.get<GymsController>(GymsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return gyms from the service', () => {
    const gyms = [{ id: 1, name: 'Downtown Gym', code: 'DOWNTOWN' }];
    gymsService.findAll.mockReturnValue(gyms);

    expect(controller.getGyms()).toBe(gyms);
  });
});

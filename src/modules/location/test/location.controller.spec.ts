import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from '../location.controller';
import { LocationService } from '../location.service';

describe('LocationController', () => {
  let controller: LocationController;
  const serviceMock = {
    create: jest.fn(),
    findByVehicle: jest.fn(),
    getVehiclesWithLastLocation: jest.fn(),
    streamVehicle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: serviceMock }],
    }).compile();
    controller = module.get(LocationController);
  });

  afterEach(() => jest.clearAllMocks());

  it('create delegates to service', async () => {
    serviceMock.create.mockResolvedValue({ id: 'l1' });
    const res = await controller.create({
      vehicleId: 'v',
      latitude: 1,
      longitude: 2,
      speed: 10,
    } as any);
    expect(res.id).toBe('l1');
  });

  it('findByVehicle wraps results', async () => {
    serviceMock.findByVehicle.mockResolvedValue([{ id: 'l1' }]);
    const res = await controller.findByVehicle('v');
    expect(res.results).toHaveLength(1);
  });

  it('findLastByVehicle returns single', async () => {
    serviceMock.getVehiclesWithLastLocation.mockResolvedValue({ id: 'l1' });
    const res = await controller.findLastByVehicle('v');
    expect(res.id).toBe('l1');
  });
});

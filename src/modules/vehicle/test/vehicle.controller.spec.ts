import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from '../vehicle.controller';
import { VehicleService } from '../vehicle.service';

describe('VehicleController', () => {
  let controller: VehicleController;

  const serviceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findVehicleLocations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [{ provide: VehicleService, useValue: serviceMock }],
    }).compile();

    controller = module.get(VehicleController);
  });

  afterEach(() => jest.clearAllMocks());

  it('findAll returns list', async () => {
    serviceMock.findAll.mockResolvedValue({
      results: [],
      total: 0,
      page: 1,
      limit: 10,
    });
    const res = await controller.findAll({ page: 1, limit: 10 } as any);
    expect(res.total).toBe(0);
  });

  it('create calls service', async () => {
    serviceMock.create.mockResolvedValue({ id: '1' });
    const res = await controller.create({
      plateNumber: '34',
      driverName: 'D',
    } as any);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res.id).toBe('1');
  });

  it('findOne returns single', async () => {
    serviceMock.findOne.mockResolvedValue({ result: { id: '1' } });
    const res = await controller.findOne('1');
    expect(res.result.id).toBe('1');
  });

  it('getVehicleLocations returns locations', async () => {
    serviceMock.findVehicleLocations.mockResolvedValue({
      results: [{ id: 'l1' }],
    });
    const res = await controller.getVehicleLocations('veh1');
    expect(res.results).toHaveLength(1);
  });
});

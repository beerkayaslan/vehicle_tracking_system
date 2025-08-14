import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../../../entities/vehicle.entity';
import { LocationService } from '../../location/location.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const createRepositoryMock = () => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepo: jest.Mocked<Repository<Vehicle>>;
  let locationService: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: createRepositoryMock(),
        },
        { provide: LocationService, useValue: { findByVehicle: jest.fn() } },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepo = module.get(getRepositoryToken(Vehicle));
    locationService = module.get<LocationService>(LocationService);
  });

  afterEach(() => jest.clearAllMocks());

  it('findAll returns paginated data with defaults', async () => {
    const entity: Vehicle = {
      id: '1',
      plateNumber: '34ABC123',
      driverName: 'Driver',
      isActive: true,
      createdAt: new Date(),
      locations: [],
    };
    vehicleRepo.findAndCount.mockResolvedValue([[entity], 1]);

    const res = await service.findAll({} as any);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(vehicleRepo.findAndCount).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10,
    });
    expect(res).toEqual({ results: [entity], total: 1, page: 1, limit: 10 });
  });

  it('create saves new vehicle', async () => {
    vehicleRepo.findOne.mockResolvedValue(null as any);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    vehicleRepo.create.mockReturnValue({
      plateNumber: '34',
      driverName: 'D',
      isActive: true,
    } as any);
    vehicleRepo.save.mockResolvedValue({ id: '1' } as any);

    const res = await service.create({
      plateNumber: '34',
      driverName: 'D',
      isActive: true,
    });

    expect(res.id).toBe('1');
  });

  it('create throws if plate exists', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: '1' } as any);
    await expect(
      service.create({ plateNumber: '34', driverName: 'D', isActive: true }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('findOne returns entity', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: '1' } as any);
    const res = await service.findOne('1');
    expect(res).toEqual({ result: { id: '1' } });
  });

  it('findOne throws NotFound', async () => {
    vehicleRepo.findOne.mockResolvedValue(null as any);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findVehicleLocations delegates to locationService', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    (locationService.findByVehicle as any).mockResolvedValue([{ id: 'l1' }]);
    const res = await service.findVehicleLocations('veh');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(locationService.findByVehicle).toHaveBeenCalledWith('veh');
    expect(res).toEqual({ results: [{ id: 'l1' }] });
  });
});

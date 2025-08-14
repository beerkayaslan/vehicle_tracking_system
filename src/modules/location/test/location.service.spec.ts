import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationService } from '../location.service';
import { Location } from '../../../entities/location.entity';
import { Vehicle } from '../../../entities/vehicle.entity';
import { LocationGateway } from '../../../gateways/location.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { firstValueFrom, take } from 'rxjs';

const repoMock = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('LocationService', () => {
  let service: LocationService;
  let locationRepo: jest.Mocked<Repository<Location>>;
  let vehicleRepo: jest.Mocked<Repository<Vehicle>>;
  let gateway: LocationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: getRepositoryToken(Location), useValue: repoMock() },
        { provide: getRepositoryToken(Vehicle), useValue: repoMock() },
        {
          provide: LocationGateway,
          useValue: { broadcastLocation: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(LocationService);
    locationRepo = module.get(getRepositoryToken(Location));
    vehicleRepo = module.get(getRepositoryToken(Vehicle));
    gateway = module.get(LocationGateway);
  });

  afterEach(() => jest.clearAllMocks());

  it('create throws when vehicle missing', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ vehicleId: 'v', latitude: 1, longitude: 2, speed: 10 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create saves and broadcasts', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: 'v' } as any);
    const entity: any = {
      vehicleId: 'v',
      latitude: 1,
      longitude: 2,
      speed: 10,
    };
    locationRepo.create.mockReturnValue(entity);
    locationRepo.save.mockResolvedValue({ id: 'loc1', ...entity });
    const res = await service.create({
      vehicleId: 'v',
      latitude: 1,
      longitude: 2,
      speed: 10,
    });
    expect(res.id).toBe('loc1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gateway.broadcastLocation).toHaveBeenCalled();
  });

  it('create throws BadRequest on save error', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: 'v' } as any);
    locationRepo.create.mockReturnValue({} as any);
    locationRepo.save.mockRejectedValue(new Error('fail'));
    await expect(
      service.create({ vehicleId: 'v', latitude: 1, longitude: 2, speed: 10 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('findByVehicle returns list', async () => {
    locationRepo.find.mockResolvedValue([{ id: 'l1' } as any]);
    const res = await service.findByVehicle('v');
    expect(res).toHaveLength(1);
  });

  it('getVehiclesWithLastLocation returns last', async () => {
    locationRepo.findOne.mockResolvedValue({ id: 'l1' } as any);
    const res = await service.getVehiclesWithLastLocation('v');
    expect(res.id).toBe('l1');
  });

  it('getVehiclesWithLastLocation throws NotFound', async () => {
    locationRepo.findOne.mockResolvedValue(null);
    await expect(
      service.getVehiclesWithLastLocation('v'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('streamVehicle emits last then live updates', async () => {
    const last: any = { id: 'last1', vehicleId: 'v' };
    locationRepo.findOne.mockResolvedValue(last);
    const obs = service.streamVehicle('v');
    const first = await firstValueFrom(obs.pipe(take(1)));
    expect(first.data).toEqual(last);
  });
});

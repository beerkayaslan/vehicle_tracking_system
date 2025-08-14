import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { CreateVehicleDto } from '../../dto/vehicle/create-vehicle.dto';
import { GetQueryVehicleDto } from '../../dto/vehicle/query-vehicle.dto';

import { LocationService } from '../location/location.service';
import { LocationResponseDto } from 'src/dto/location/reponse-location.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly locationService: LocationService,
  ) {}

  async findAll(query: GetQueryVehicleDto): Promise<{
    results: Vehicle[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [results, total] = await this.vehicleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { results, total, page, limit };
  }

  async create(createVehicleDto: CreateVehicleDto) {
    const existing = await this.vehicleRepository.findOne({
      where: { plateNumber: createVehicleDto.plateNumber },
    });
    if (existing) {
      throw new ConflictException('Bu plaka ile zaten bir araç mevcut.');
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);

    try {
      return await this.vehicleRepository.save(vehicle);
    } catch {
      throw new ConflictException('Bu plaka ile zaten bir araç mevcut.');
    }
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı.');
    }
    return {
      result: vehicle,
    };
  }

  async findVehicleLocations(
    id: string,
  ): Promise<{ results: LocationResponseDto[] }> {
    const items: LocationResponseDto[] =
      await this.locationService.findByVehicle(id);
    return { results: items };
  }
}

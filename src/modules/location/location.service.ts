import {
  BadRequestException,
  Injectable,
  NotFoundException,
  MessageEvent,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { CreateLocationDto } from '../../dto/location/create-location.dto';
import {
  Observable,
  Subject,
  concat,
  from,
  map,
  catchError,
  filter,
  EMPTY,
} from 'rxjs';
import { LocationGateway } from '../../gateways/location.gateway';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly locationGateway: LocationGateway,
  ) {}

  private readonly vehicleStreams = new Map<string, Subject<Location>>();

  private getOrCreateStream(vehicleId: string): Subject<Location> {
    let s = this.vehicleStreams.get(vehicleId);
    if (!s) {
      s = new Subject<Location>();
      this.vehicleStreams.set(vehicleId, s);
    }
    return s;
  }

  async create(createLocationDto: CreateLocationDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createLocationDto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı.');
    }

    const location = this.locationRepository.create({
      vehicleId: createLocationDto.vehicleId,
      latitude: createLocationDto.latitude,
      longitude: createLocationDto.longitude,
      speed: createLocationDto.speed,
    });

    try {
      const saved = await this.locationRepository.save(location);
      // sse emit
      const stream = this.vehicleStreams.get(saved.vehicleId);
      if (stream) {
        stream.next(saved);
      }
      // websocket broadcast
      this.locationGateway.broadcastLocation(saved);
      return saved;
    } catch {
      throw new BadRequestException('Konum kaydedilemedi.');
    }
  }

  async findByVehicle(vehicleId: string) {
    return this.locationRepository.find({
      where: { vehicleId },
      order: { timestamp: 'DESC' },
    });
  }

  async getVehiclesWithLastLocation(vehicleId: string) {
    const last = await this.locationRepository.findOne({
      where: { vehicleId },
      order: { timestamp: 'DESC' },
    });

    if (!last) {
      throw new NotFoundException('Konum bulunamadı.');
    }

    return last;
  }

  streamVehicle(vehicleId: string): Observable<MessageEvent> {
    const subject = this.getOrCreateStream(vehicleId);

    const last$ = from(
      this.locationRepository.findOne({
        where: { vehicleId },
        order: { timestamp: 'DESC' },
      }),
    ).pipe(
      filter((v): v is Location => !!v),
      map((location) => ({ data: location }) as MessageEvent),
      catchError(() => EMPTY),
    );

    const live$ = subject
      .asObservable()
      .pipe(map((location) => ({ data: location }) as MessageEvent));

    return concat(last$, live$);
  }
}

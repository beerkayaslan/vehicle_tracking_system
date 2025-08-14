import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationGateway } from '../../gateways/location.gateway';
import { Location } from '../../entities/location.entity';
import { Vehicle } from '../../entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Vehicle])],
  controllers: [LocationController],
  providers: [LocationService, LocationGateway],
  exports: [LocationService, LocationGateway],
})
export class LocationModule {}

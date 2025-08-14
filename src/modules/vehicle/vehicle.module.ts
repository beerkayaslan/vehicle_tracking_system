import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle } from '../../entities/vehicle.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), LocationModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

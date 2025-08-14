import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from '../../dto/location/create-location.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LocationListResponseDto,
  LocationResponseDto,
} from '../../dto/location/reponse-location.dto';
import { Observable } from 'rxjs';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiBody({ type: CreateLocationDto })
  @ApiCreatedResponse({
    description: 'Konum başarıyla oluşturuldu.',
    type: LocationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Geçersiz istek verisi.' })
  @ApiNotFoundResponse({ description: 'Araç bulunamadı.' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    return this.locationService.create(createLocationDto);
  }

  @Get('vehicle/:vehicleId')
  @ApiOkResponse({
    description: 'Araca ait konum geçmişi listelendi.',
    type: LocationListResponseDto,
  })
  async findByVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<LocationListResponseDto> {
    const results = await this.locationService.findByVehicle(vehicleId);
    return { results };
  }

  @Get('vehicle/:vehicleId/last')
  @ApiOkResponse({
    description: 'Aracın son konumu getirildi.',
    type: LocationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Konum bulunamadı.' })
  async findLastByVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<LocationResponseDto> {
    return this.locationService.getVehiclesWithLastLocation(vehicleId);
  }

  @Sse('vehicle/:vehicleId/stream')
  @ApiOkResponse({ description: 'SSE ile canlı konum akışı.' })
  sseVehicleLocations(
    @Param('vehicleId') vehicleId: string,
  ): Observable<MessageEvent> {
    return this.locationService.streamVehicle(vehicleId);
  }
}

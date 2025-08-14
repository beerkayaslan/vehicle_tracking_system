import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from '../../dto/vehicle/create-vehicle.dto';
import { GetQueryVehicleDto } from '../../dto/vehicle/query-vehicle.dto';
import { PageResponseDto } from '../../dto/utils/paged-response.dto';
import {
  VehicleResponseDto,
  VehicleSingleResponseDto,
} from '../../dto/vehicle/response-vehicle.dto';
import { LocationListResponseDto } from '../../dto/location/reponse-location.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @ApiOkResponse({
    description: 'Araçlar listelendi.',
    type: PageResponseDto,
  })
  async findAll(
    @Query() query: GetQueryVehicleDto,
  ): Promise<PageResponseDto<VehicleResponseDto>> {
    return await this.vehicleService.findAll(query);
  }

  @Post()
  @ApiBody({ type: CreateVehicleDto })
  @ApiCreatedResponse({ description: 'Araç başarıyla oluşturuldu.' })
  @ApiBadRequestResponse({ description: 'Geçersiz istek verisi.' })
  @ApiConflictResponse({ description: 'Bu plaka ile zaten bir araç var.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Araç bulundu.',
    type: VehicleSingleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Araç bulunamadı.' })
  async findOne(@Param('id') id: string): Promise<VehicleSingleResponseDto> {
    return this.vehicleService.findOne(id);
  }

  @Get(':id/locations')
  @ApiOkResponse({
    description: 'Araca ait konum geçmişi listelendi.',
    type: LocationListResponseDto,
  })
  async getVehicleLocations(
    @Param('id') id: string,
  ): Promise<LocationListResponseDto> {
    const items = this.vehicleService.findVehicleLocations(id);
    return items;
  }
}

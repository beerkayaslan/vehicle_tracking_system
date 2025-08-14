import { ApiProperty } from '@nestjs/swagger';

export class LocationResponseDto {
  @ApiProperty({ description: 'Konum kaydı ID' })
  id: string;

  @ApiProperty({ description: 'Araç ID' })
  vehicleId: string;

  @ApiProperty({ description: 'Enlem', type: Number, example: 41.0082 })
  latitude: number;

  @ApiProperty({ description: 'Boylam', type: Number, example: 28.9784 })
  longitude: number;

  @ApiProperty({ description: 'Hız (km/s)', type: Number, example: 60 })
  speed: number;

  @ApiProperty({
    description: 'Zaman damgası',
    type: String,
    format: 'date-time',
  })
  timestamp: Date;
}

export class LocationListResponseDto {
  @ApiProperty({
    description: 'Sonuçlar',
    type: LocationResponseDto,
    isArray: true,
  })
  results: LocationResponseDto[];
}

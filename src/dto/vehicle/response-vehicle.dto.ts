import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty({ description: 'Araç ID' })
  id: string;

  @ApiProperty({ description: 'Plaka' })
  plateNumber: string;

  @ApiProperty({ description: 'Sürücü adı' })
  driverName: string;

  @ApiProperty({ description: 'Aktiflik durumu' })
  isActive: boolean;

  @ApiProperty({
    description: 'Oluşturulma tarihi',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}

export class VehicleSingleResponseDto {
  @ApiProperty({ description: 'Sonuç', type: VehicleResponseDto })
  result: VehicleResponseDto;
}

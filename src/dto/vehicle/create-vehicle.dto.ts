import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: '34ABC123',
    description: 'Araç plaka numarası',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @ApiProperty({
    example: 'Ahmet Yılmaz',
    description: 'Sürücü adı',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  driverName: string;

  @ApiPropertyOptional({
    description: 'Aktiflik durumu',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

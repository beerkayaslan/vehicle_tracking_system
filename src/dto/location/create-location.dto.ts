import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: "Konumun ait olduğu araç ID'si",
    format: 'uuid',
    example: '5a2f0b7e-3c4d-4b1a-9b9a-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty({
    description: 'Enlem',
    type: Number,
    example: 41.0082,
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Boylam',
    type: Number,
    example: 28.9784,
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Hız (km/s)',
    type: Number,
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  speed: number;
}

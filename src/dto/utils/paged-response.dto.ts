import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PageResponseDto<T> {
  @ApiProperty({
    description: 'Array of results',
    isArray: true,
  })
  @Expose()
  results: T[];

  @ApiProperty({
    description: 'Current page number',
    type: Number,
    example: 1,
  })
  @Expose()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @Expose()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    type: Number,
    example: 100,
  })
  @Expose()
  @Type(() => Number)
  total: number;

  constructor(results: T[], page: number, limit: number, total: number) {
    this.results = results;
    this.page = page;
    this.limit = limit;
    this.total = total;
  }
}

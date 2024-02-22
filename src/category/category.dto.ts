import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NormalCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class DailyMealCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  startTime: number;

  @ApiProperty()
  @IsNotEmpty()
  endTime: number;
}

export class CategoryImageDto {
    @ApiProperty()
    @IsNotEmpty()
    imageURL: string;
  }
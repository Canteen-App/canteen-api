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
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  endTime: string;
}

export class CategoryImageDto {
  @ApiProperty()
  @IsNotEmpty()
  imageURL: string;
}

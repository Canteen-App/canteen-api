import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  feedback: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  description: string;
}

export class EditItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  description: string;
}

export class SetItemImageDto {
  @ApiProperty()
  @IsNotEmpty()
  imageURL: string;
}

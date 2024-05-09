import { IsNotEmpty } from 'class-validator';
import { OrderItemCreateType } from './order.type';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCheckoutDto {
  @ApiProperty()
  @IsNotEmpty()
  orderList: OrderItemCreateType[];

  @ApiProperty()
  @IsNotEmpty()
  currentUserDiplayedAmount: number;
}

export class OrderCollectionDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  collectItemCountList: { collectAmount: number; itemId: string }[];
}

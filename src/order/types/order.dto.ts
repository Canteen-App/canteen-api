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

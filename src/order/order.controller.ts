import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/intent')
  async makePaymentIntent(@Body() { amount }) {
    return this.orderService.makePaymentIntent(amount)
  }
}

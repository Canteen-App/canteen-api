import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';
import { OrderCheckoutDto } from './types/order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
@UseGuards(FirebaseAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiBearerAuth()
  @Get('paid')
  async getPaidOrders(@Req() req) {
    return this.orderService.getPaidOrders();
  }
  @ApiBearerAuth()
  @Post('checkout')
  async checkoutOrder(
    @Req() req,
    @Body() { orderList, currentUserDiplayedAmount }: OrderCheckoutDto,
  ) {
    return this.orderService.checkoutOrder(
      req.user,
      orderList,
      currentUserDiplayedAmount,
    );
  }

  @ApiBearerAuth()
  @Get('to-pay')
  async getUnPaidUserOrders(@Req() req) {
    return this.orderService.getUnPaidUserOrders(req.user);
  }

  @ApiBearerAuth()
  @Get('to-recieve')
  async getToRecieveOrders(@Req() req) {
    return this.orderService.getToRecieveOrders(req.user);
  }

  @ApiBearerAuth()
  @Get('check-payment/:id')
  async checkPaymentMade(@Param('id') orderId: string) {
    return this.orderService.checkPaymentMade(orderId);
  }

  @ApiBearerAuth()
  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') orderId: string) {
    return this.orderService.getPaymentIntent(orderId);
  }

  @ApiBearerAuth()
  @Get(':id')
  async getOrderDetails(@Param('id') orderId: string) {
    return this.orderService.getOrderDetails(orderId);
  }
}

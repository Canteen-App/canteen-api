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
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiBearerAuth()
  @Post('checkout')
  @UseGuards(FirebaseAuthGuard)
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
  @UseGuards(FirebaseAuthGuard)
  async getUnPaidUserOrders(@Req() req) {
    return this.orderService.getUnPaidUserOrders(req.user);
  }

  @ApiBearerAuth()
  @Get('to-recieve')
  @UseGuards(FirebaseAuthGuard)
  async getToRecieveOrders(@Req() req) {
    return this.orderService.getToRecieveOrders(req.user);
  }

  @ApiBearerAuth()
  @Get('check-payment/:id')
  @UseGuards(FirebaseAuthGuard)
  async checkPaymentMade(@Param('id') orderId: string) {
    return this.orderService.checkPaymentMade(orderId);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async getOrderDetails(@Param('id') orderId: string) {
    return this.orderService.getOrderDetails(orderId);
  }
}

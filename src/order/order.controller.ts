import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';
import { OrderCheckoutDto, OrderCollectionDto } from './types/order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiOperation({ summary: "Get Today's Order Details" })
  @Get('/get-order/:id')
  async getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @ApiOperation({ summary: 'Get Orders by Date' })
  @Get('/orders')
  async getOrders(@Query('date') date: string) {
    return this.orderService.getOrdersByDate(date);
  }

  @ApiOperation({ summary: 'Get Order Details by ID' })
  @Get('customer/:orderId')
  async getCustomerOrderDetails(@Param('orderId') orderId: string, @Req() req) {
    return this.orderService.getCustomerOrderDetails(orderId, req.user);
  }

  @ApiOperation({ summary: 'Get Paid Orders' })
  @Get('paid')
  async getPaidOrders(@Req() req) {
    return this.orderService.getPaidOrders();
  }

  @ApiOperation({ summary: 'Checkout Order' })
  @Post('checkout')
  async checkoutOrder(
    @Req() req,
    @Body()
    { orderList, currentUserDisplayedAmount, preOrderDate }: OrderCheckoutDto,
  ) {
    return this.orderService.checkoutOrder(
      req.user,
      orderList,
      currentUserDisplayedAmount,
      preOrderDate,
    );
  }

  @ApiOperation({ summary: 'Get Unpaid User Orders' })
  @Get('unpaid')
  async getUnPaidUserOrders(@Req() req) {
    return this.orderService.getUnPaidUserOrders(req.user);
  }

  @ApiOperation({ summary: 'Get Orders to Receive' })
  @Get('to-receive')
  async getToReceiveOrders(@Req() req) {
    return this.orderService.getToReceiveOrders(req.user);
  }

  @ApiOperation({ summary: 'Check Payment Made for Order' })
  @Get('check-payment/:id')
  async checkPaymentMade(@Param('id') orderId: string) {
    return this.orderService.checkPaymentMade(orderId);
  }

  @ApiOperation({ summary: 'Get Payment Intent for Order' })
  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') orderId: string) {
    return this.orderService.getPaymentIntent(orderId);
  }

  @ApiOperation({ summary: 'Generate Order Code' })
  @Get('generate-code/:id')
  async generateOrderCode(@Req() req, @Param('id') orderId: string) {
    return this.orderService.generateOrderCode(req.user, orderId);
  }

  @ApiOperation({ summary: 'Process Order Collection' })
  @Post('collection/:id')
  async orderCollection(
    @Body() { code, collectItemCountList }: OrderCollectionDto,
    @Param('id') orderId: string,
  ) {
    return this.orderService.orderCollection(
      orderId,
      code,
      collectItemCountList,
    );
  }
}

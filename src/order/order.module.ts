import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { OrderTasksService } from './order.tasks.service';

@Module({
  providers: [OrderService, PrismaService, OrderTasksService],
  controllers: [OrderController],
})
export class OrderModule {}

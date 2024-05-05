import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderTasksService {
  constructor(private prisma: PrismaService) {}

  @Cron('* * * * *')
  async handleCron() {
    try {
      console.log('Running Cron Job...');
      const currentDate = new Date();
      const twoHoursAgo = new Date(currentDate.getTime() - 2 * 60 * 60 * 1000); // Two hours ago

      // Retrieve orders that are still pending and were placed more than 2 hours ago
      const orders = await this.prisma.order.findMany({
        where: {
          AND: [
            { orderTime: { lte: twoHoursAgo } }, // Orders placed more than 2 hours ago
            { status: 'PENDING_PAYMENT' },
          ],
        },
        include: {
          payment: {
            where: { status: 'PENDING' },
          },
        },
      });

      console.log(orders);

      // Iterate through each order and update if payment is still pending
      for (const order of orders) {
        if (order.payment) {
          // Set both the order and payment status to "cancelled"
          await this.prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELED' },
          });
          await this.prisma.payment.update({
            where: { id: order.payment.id },
            data: { status: 'CANCELED' },
          });
        }
      }
    } catch (error) {
      // Handle errors
      console.error('Error in cron job:', error);
    }
  }
}

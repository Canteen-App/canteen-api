import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { getTodaysDate } from 'utils/getDate';

@Injectable()
export class OrderTasksService {
  constructor(private prisma: PrismaService) {}

  @Cron('* * * * *')
  async handleMinuteCron() {
    this.handlePaymentTimeExceeding();
    this.handleCollectionExceeding();
  }

  private async handlePaymentTimeExceeding() {
    try {
      const currentDate = new Date();
      const twoHoursAgo = new Date(currentDate.getTime() - 2 * 60 * 60 * 1000); // Two hours ago

      // Retrieve orders that are still pending and were placed more than 2 hours ago
      const orders = await this.prisma.order.findMany({
        where: {
          AND: [
            { orderPlaced: { lte: twoHoursAgo } }, // Orders placed more than 2 hours ago
            { status: 'PENDING_PAYMENT' },
          ],
        },
        include: {
          payment: {
            where: { status: 'PENDING' },
          },
        },
      });

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

  private async handleCollectionExceeding() {
    try {
      const todaysDate = getTodaysDate();

      // Retrieve orders with status "PENDING_COLLECTION" and payment status "COMPLETE"
      const orders = await this.prisma.order.findMany({
        where: {
          AND: [
            {
              // Order Date is the date the order should be collected, includes Pre Order Date.
              orderDate: {
                lte: todaysDate.startOfDay,
              },
            }, // Orders placed before the start of the previous day
            { status: 'PENDING_COLLECTION' },
          ],
        },
        include: {
          payment: {
            where: { status: 'COMPLETE' },
          },
        },
      });

      // Iterate through each order and update status if criteria met
      for (const order of orders) {
        // Set order status to "NOT_COLLECTED"
        await this.prisma.order.update({
          where: { id: order.id },
          data: { status: 'NOT_COLLECTED' },
        });
      }
    } catch (error) {
      // Handle errors
      console.error('Error in daily cron job:', error);
    }
  }
}

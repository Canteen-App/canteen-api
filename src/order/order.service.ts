import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { OrderItemCreateType } from './types/order.type';
import { getStartEndDates, getTodaysDate } from 'utils/getDate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { checkPreOrder } from '../../utils/checkPreOrder';

const stripe = require('stripe')(process.env.STRIPE_KEY);

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getOrdersByDate(dateStr?: string) {
    const dateFilter = getStartEndDates(dateStr);

    return await this.prisma.order.findMany({
      where: {
        AND: {
          status: 'PENDING_COLLECTION',
          payment: {
            status: {
              equals: 'COMPLETE',
            },
          },
          orderDate: {
            gte: dateFilter.startOfDay,
            lte: dateFilter.endOfDay,
          },
        },
      },
      orderBy: {
        orderDate: 'asc',
      },
      include: {
        payment: true,
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        AND: {
          id: orderId,
          status: 'PENDING_COLLECTION',
          payment: {
            status: {
              equals: 'COMPLETE',
            },
          },
        },
      },
      orderBy: {
        orderDate: 'asc',
      },
      include: {
        payment: true,
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return order;
  }

  async getPaidOrders() {
    return await this.prisma.order.findMany({
      where: {
        status: 'PENDING_COLLECTION',
        payment: {
          status: {
            equals: 'COMPLETE',
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
      include: {
        payment: true,
        customer: true,
        items: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  async checkoutOrder(
    user: any,
    orderList: OrderItemCreateType[],
    currentUserDiplayedAmount: number,
    preOrderDate?: string,
  ) {
    const orderDetails = await this.prisma.$transaction(async (tx) => {
      // Current Order Items Map
      const itemList = new Map();

      // Calculate total amount and check if it is the same amount displayed to the user
      let totalAmount = 0;
      for (let orderItem of orderList) {
        // Adds Order Item price times its quantity
        const itemDetails = await this.prisma.item.findUnique({
          where: { id: orderItem.itemId },
        });
        itemList.set(itemDetails.id, {
          name: itemDetails.name,
          price: itemDetails.price,
        });
        totalAmount += itemDetails.price * orderItem.quantity;
      }

      // Gives an error if the current total amount on the server doesn't match what is shown to the user from the client
      if (totalAmount != currentUserDiplayedAmount) {
        throw new Error('Wrong total amount displayed to user');
      }

      // Create Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Total Amount times 100, stripe takes values from cents 1000 cents -> Rs10 charged
        currency: 'lkr',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Add Order Details with Order Items including payment
      const order = await tx.order.create({
        data: {
          customer: {
            connect: {
              id: user.uid as string,
            },
          },
          // If pre-order date given enter that or leave undefined for default current date.
          orderDate: checkPreOrder(preOrderDate),
          items: {
            // Create all Order Items with item and quantity
            create: orderList.map((item) => {
              return {
                item: {
                  connect: {
                    id: item.itemId,
                  },
                },
                billedItemName: itemList.get(item.itemId).name,
                billedPricePerQuantity: itemList.get(item.itemId).price,
                quantity: item.quantity,
              };
            }),
          },
          payment: {
            create: {
              totalAmount: totalAmount,
              stripePaymentIntentId: paymentIntent.id,
            },
          },
        },
        include: {
          items: {
            include: {
              item: true,
            },
          },
          payment: true,
        },
      });
      return {
        orderDetails: order,
        paymentIntent: paymentIntent.client_secret,
      };
    });

    return orderDetails;
  }

  async getPaymentIntent(orderId: string) {
    const orderPayment = await this.prisma.payment.findUnique({
      where: {
        orderId: orderId,
        status: 'PENDING',
      },
    });

    const paymentIntent = await stripe.paymentIntents.retrieve(
      orderPayment.stripePaymentIntentId,
    );

    const latest_charge = paymentIntent.latest_charge;
    if (latest_charge) {
      const charge = await stripe.charges.retrieve(latest_charge);

      if (charge.paid) {
        await this.prisma.order.update({
          where: {
            id: orderPayment.orderId,
          },
          data: {
            status: 'PENDING_COLLECTION',
            payment: {
              update: {
                status: 'COMPLETE',
                paymentTime: new Date(charge.created * 1000),
              },
            },
          },
        });

        return { paid: true, message: 'Already Paid' };
      }
    }

    return { paymentIntent: paymentIntent?.client_secret };
  }

  async getUnPaidUserOrders(user: any) {
    return this.prisma.order.findMany({
      select: {
        id: true,
        orderDate: true,
        orderPlaced: true,
        _count: {
          select: {
            items: true,
          },
        },
        payment: true,
      },
      where: {
        AND: {
          customer: {
            id: user.uid,
          },
          status: 'PENDING_PAYMENT',
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });
  }

  async getToRecieveOrders(user: any) {
    return this.prisma.order.findMany({
      select: {
        id: true,

        orderDate: true,
        orderPlaced: true,
        _count: {
          select: {
            items: true,
          },
        },
        payment: true,
      },
      where: {
        AND: {
          customer: {
            id: user.uid,
          },
          status: 'PENDING_COLLECTION',
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });
  }

  async checkPaymentMade(orderId) {
    const orderPayment = await this.prisma.payment.findUnique({
      where: {
        orderId: orderId,
      },
    });

    const paymentIntentId = orderPayment.stripePaymentIntentId;

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const latest_charge = intent.latest_charge;
    if (latest_charge) {
      const charge = await stripe.charges.retrieve(latest_charge);

      if (charge.paid) {
        const paidOrder = await this.prisma.order.update({
          where: {
            id: orderPayment.orderId,
          },
          data: {
            status: 'PENDING_COLLECTION',
            payment: {
              update: {
                status: 'COMPLETE',
                paymentTime: new Date(charge.created * 1000),
              },
            },
          },
        });

        this.eventEmitter.emit('payment.complete', { orderId: paidOrder.id });

        return paidOrder;
      }
    }
    return null;
  }

  async getOrderDetails(orderId: string) {
    const order = (await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            item: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    categoryType: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
      },
    })) as any;

    // Check if the order is a pre-order
    if (order && order.orderDate && order.orderPlaced) {
      const orderDate = new Date(order.orderDate);
      const orderPlaced = new Date(order.orderPlaced);

      order.isPreOrder = orderDate > orderPlaced;
    }

    return order;
  }

  private async generateCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10); // Generates a random digit between 0 and 9
    }

    const orderCodes = await this.prisma.orderVerifyCode.findFirst({
      where: {
        code: code,
      },
    });

    if (orderCodes) {
      this.generateCode();
    } else {
      return code;
    }
  }

  async generateOrderCode(user, orderId) {
    const code = await this.generateCode();
    const todaysDate = getTodaysDate();
    try {
      const order = await this.prisma.order.update({
        where: {
          id: orderId,
          orderDate: {
            gte: todaysDate.startOfDay,
            lte: todaysDate.endOfDay,
          },
        },
        data: {
          orderVerifyCode: {
            upsert: {
              update: {
                code: code,
              },
              create: {
                code: code,
              },
            },
          },
        },
      });

      if (order.customerId == user.uid) {
        return { verifyOrderCode: code };
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  async orderCollection(
    orderId: string,
    code: string,
    collectItemCountList: { itemId: string; collectAmount: number }[],
  ) {
    const currentTime = new Date();
    const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);

    // Start Prisma transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const codeOrder = await prisma.orderVerifyCode.findFirst({
        where: {
          AND: {
            code: code,
            orderId: orderId,
            createdAt: {
              gt: fiveMinutesAgo,
            },
          },
        },
      });

      if (!codeOrder) {
        return false;
      }

      const orderItems = [];
      for (const { itemId, collectAmount } of collectItemCountList) {
        // Fetch item
        const item = await prisma.orderItem.findUnique({
          where: {
            id: itemId,
          },
          select: {
            quantity: true,
            quantityCollected: true,
          },
        });

        // Calculate the new quantityCollected
        const newQuantityCollected = Math.min(
          item.quantity,
          item.quantityCollected + collectAmount,
        );

        // Update item within the transaction
        const orderItem = await prisma.orderItem.update({
          where: {
            id: itemId,
          },
          data: {
            quantityCollected: newQuantityCollected,
          },
        });

        orderItems.push(orderItem);
      }

      // Emit event outside the transaction
      this.eventEmitter.emit('items.collected', { orderId: orderId });

      return orderItems;
    });

    return result;
  }
}

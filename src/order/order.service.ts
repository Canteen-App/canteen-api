import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { OrderItemCreateType } from './types/order.type';

const stripe = require('stripe')(process.env.STRIPE_KEY);

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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
        orderTime: 'desc',
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

        orderTime: true,
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
        orderTime: 'desc',
      },
    });
  }

  async getToRecieveOrders(user: any) {
    return this.prisma.order.findMany({
      select: {
        id: true,

        orderTime: true,
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
        orderTime: 'desc',
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
        const paymentMade = await this.prisma.order.update({
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

        return paymentMade;
      }
    }
    return null;
  }

  async getOrderDetails(orderId: string) {
    return await this.prisma.order.findUnique({
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
    });
  }
}

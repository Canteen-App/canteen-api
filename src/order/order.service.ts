import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
const stripe = require('stripe')(process.env.STRIPE_KEY);

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async makePaymentIntent(amount) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'lkr',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return { paymentIntent: paymentIntent.client_secret };
    } catch (error) {
      return { error: error.message };
    }
  }
}

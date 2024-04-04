import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getCustomerAccount(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: id },
    });

    return customer;
  }

  async createCustomerAccount(data: { id: string; name: string }) {
    const newCustomer = await this.prisma.customer.create({
      data: data,
    });

    return newCustomer;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: {
    name: string;
    categoryId: string;
    price: number;
    description?: string;
  }) {
    try {
      const newItem = await this.prisma.item.create({
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          category: { connect: { id: data.categoryId } },
        },
      });

      return newItem;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getItemById(id: string) {
    try {
      return await this.prisma.item.findUnique({
        where: { id },
        include: { category: true, orderItems: true, reviews: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientValidationError
    ) {
      throw new BadRequestException(error.message);
    } else {
      console.error(error);
      throw new BadRequestException('Unknown Error');
    }
  }
}

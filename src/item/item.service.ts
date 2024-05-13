import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { getTodaysDate } from 'utils/getDate';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

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

  async getItemInfo(user, id: string) {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id },
        include: {
          category: true,
          likes: {
            where: {
              customer: {
                id: user.uid,
              },
            },
          },
          reviews: {
            include: {
              customer: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (item) {
        // If there's a like, extract the first one from the array
        item.likes = item.likes[0] || (null as any);
      }

      return item;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getItemByCategory(categoryId: string) {
    try {
      return await this.prisma.item.findMany({
        where: { categoryId: categoryId },
        include: { category: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

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

  async editItem(
    itemId: string,
    data: {
      name?: string;
      price?: number;
      description?: string;
    },
  ) {
    try {
      const updatedItem = await this.prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          name: data.name ?? undefined,
          price: data.price ?? undefined,
          description: data.description ?? undefined,
        },
      });

      return updatedItem;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async setItemImage(id: string, imageURL: string) {
    try {
      const newItem = await this.prisma.item.update({
        where: {
          id: id,
        },
        data: {
          imageURL: imageURL,
        },
      });

      return newItem;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getTodaysItemOrders(itemId: string) {
    try {
      const todaysDate = getTodaysDate();

      const item = (await this.prisma.item.findUnique({
        where: {
          id: itemId,
        },
        include: {
          category: true,
          orderItems: {
            where: {
              order: {
                AND: {
                  orderDate: {
                    gte: todaysDate.startOfDay,
                    lte: todaysDate.endOfDay,
                  },
                  status: 'PENDING_COLLECTION',
                },
              },
            },
            include: {
              order: {
                include: {
                  payment: true,
                },
              },
            },
          },
        },
      })) as any;

      // Calculate total quantity
      let totalQuantity = 0;
      item.orderItems.forEach((orderItem) => {
        totalQuantity += orderItem.quantity;
      });

      // Add total quantity to the item object
      item.totalQuantity = totalQuantity;

      return item;
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

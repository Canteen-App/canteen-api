import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async likeItem(user, itemId) {
    return await this.prisma.favorite.create({
      data: {
        customer: {
          connect: {
            id: user.uid,
          },
        },
        item: {
          connect: {
            id: itemId,
          },
        },
      },
    });
  }

  async unlikeItem(user, itemId) {
    try {
      return await this.prisma.favorite.delete({
        where: {
          itemId_customerId: {
            customerId: user.uid,
            itemId: itemId,
          },
        },
      });
    } catch (error) {
      return null;
    }
  }
}

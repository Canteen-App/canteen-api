import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async likeItem(user, itemId) {
    // Check if user has already liked
    const checkLike = await this.prisma.favorite.findUnique({
      where: {
        itemId_customerId: { customerId: user.uid, itemId: itemId },
      },
    });
    // If user has already liked then it is return
    if (checkLike) {
      return checkLike;
    }

    // Else the user and item relationship is created to show user likes the item
    return await this.prisma.favorite.create({
      data: {
        customer: { connect: { id: user.uid } },
        item: { connect: { id: itemId } },
      },
    });
  }

  async unlikeItem(user, itemId) {
    try {
      // Remove user and item relationship to remove like
      return await this.prisma.favorite.delete({
        where: {
          itemId_customerId: { customerId: user.uid, itemId: itemId },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async makeReview(user, itemId, data: { rating: number; feedback: string }) {
    try {
      return await this.prisma.review.create({
        data: {
          customer: { connect: { id: user.uid } },
          item: {
            connect: {
              id: itemId,
            },
          },
          rating: data.rating,
          feedback: data.feedback ?? '',
        },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      return null;
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(categoryType: CategoryType) {
    try {
      return await this.prisma.category.findMany({
        where: { categoryType: categoryType },
        include: {
          items: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getCategoryById(user, categoryId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          items: {
            include: {
              likes: {
                where: {
                  customerId: user.uid,
                },
              },
            },
          },
        },
      });

      if (category) {
        category.items.forEach((item) => {
          item.likes = item.likes[0] || (null as any);
        });
      }

      return category;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async createNormalCategory(data: { name: string }) {
    try {
      return await this.prisma.category.create({
        data: { name: data.name, categoryType: CategoryType.NORMAL_CATEGORY },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async createDailyMealCategory(data: {
    name: string;
    startTime: string;
    endTime: string;
  }) {
    try {
      return await this.prisma.category.create({
        data: {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          categoryType: CategoryType.DAILY_MEAL,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateNormalCategory(
    categoryId: string,
    data: { name: string | undefined },
  ) {
    try {
      return await this.prisma.category.update({
        where: { id: categoryId },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateDailyMealCategory(
    categoryId: string,
    data: {
      name: string | undefined;
      startTime: string | undefined;
      endTime: string | undefined;
    },
  ) {
    try {
      return await this.prisma.category.update({
        where: { id: categoryId },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async addCategoryImage(categoryId: string, data: { imageURL: string }) {
    try {
      return await this.prisma.category.update({
        where: { id: categoryId },
        data,
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

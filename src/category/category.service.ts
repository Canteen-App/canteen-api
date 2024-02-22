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

  async getNormalCategories() {
    try {
      return await this.prisma.category.findMany({
        where: { categoryType: CategoryType.NORMAL_CATEGORY },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getDailyMealCategories() {
    try {
      return await this.prisma.category.findMany({
        where: { categoryType: CategoryType.DAILY_MEAL },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getCategoryById(categoryId: string) {
    try {
      return await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { items: true },
      });
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
    startTime: number;
    endTime: number;
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
      startTime: number | undefined;
      endTime: number | undefined;
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

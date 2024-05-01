import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CategoryImageDto,
  DailyMealCategoryDto,
  NormalCategoryDto,
} from './category.dto';
import { CategoryType } from '@prisma/client';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';

@ApiTags('Category')
@Controller('category')
@UseGuards(FirebaseAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Gets all Normal Menu Categories' })
  @Get(':categoryType')
  async viewNormalCategories(
    @Param('categoryType') categoryType: CategoryType,
  ) {
    return this.categoryService.getCategories(categoryType);
  }

  @ApiOperation({ summary: 'Gets Category by id' })
  @Get('/id/:categoryId')
  async viewCategory(@Req() req, @Param('categoryId') categoryId: string) {
    return this.categoryService.getCategoryById(req.user, categoryId);
  }

  @ApiOperation({ summary: 'Creates a Normal Menu Category' })
  @ApiBody({
    type: NormalCategoryDto,
  })
  @Post(CategoryType.NORMAL_CATEGORY)
  async createNormalCategories(@Body() data: NormalCategoryDto) {
    return this.categoryService.createNormalCategory(data);
  }

  @ApiOperation({ summary: 'Creates a Daily Meal Category' })
  @ApiBody({
    type: DailyMealCategoryDto,
  })
  @Post(CategoryType.DAILY_MEAL)
  async createDailyMealCategory(@Body() data: DailyMealCategoryDto) {
    return this.categoryService.createDailyMealCategory(data);
  }

  @ApiOperation({ summary: 'Updates a Normal Category' })
  @ApiBody({
    type: NormalCategoryDto,
  })
  @Put('normal/:id')
  async updateNormalCategories(@Param('id') categoryId: string, @Body() data) {
    return this.categoryService.updateNormalCategory(categoryId, data);
  }

  @ApiOperation({ summary: 'Updates a Daily Menu Category' })
  @ApiBody({
    type: DailyMealCategoryDto,
  })
  @Put('dail-meals/:id')
  async updateDailyMealCategory(
    @Param('id') categoryId: string,
    @Body() data: DailyMealCategoryDto,
  ) {
    return this.categoryService.updateDailyMealCategory(categoryId, data);
  }

  @ApiOperation({ summary: 'Adds Image URL to a category' })
  @ApiBody({
    type: CategoryImageDto,
  })
  @Put(':id/image')
  async addCategoryImage(
    @Param('id') categoryId: string,
    @Body() data: CategoryImageDto,
  ) {
    return this.categoryService.addCategoryImage(categoryId, data);
  }
}

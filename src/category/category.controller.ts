import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CategoryImageDto,
  DailyMealCategoryDto,
  NormalCategoryDto,
} from './category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Gets all Normal Menu Categories' })
  @Get('normal')
  async viewNormalCategories() {
    return this.categoryService.getNormalCategories();
  }

  @ApiOperation({ summary: 'Gets all Daily Menu Categories' })
  @Get('daily-meals')
  async viewDailyMeals() {
    return this.categoryService.getDailyMealCategories();
  }

  @ApiOperation({ summary: 'Gets Category by id' })
  @Get(':id')
  async viewCategory(@Param('id') categoryId: string) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @ApiOperation({ summary: 'Creates a Normal Menu Category' })
  @ApiBody({
    type: NormalCategoryDto,
  })
  @Post('normal')
  async createNormalCategories(@Body() data: NormalCategoryDto) {
    return this.categoryService.createNormalCategory(data);
  }

  @ApiOperation({ summary: 'Creates a Daily Meal Category' })
  @ApiBody({
    type: DailyMealCategoryDto,
  })
  @Post('dail-meals')
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

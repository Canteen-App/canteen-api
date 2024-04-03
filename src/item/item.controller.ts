import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto, EditItemDto, SetItemImageDto } from './item.dto';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @ApiOperation({ summary: 'Gets Item by Category' })
  @Get('/category/:categoryId')
  async getItemsByCategory(@Param('categoryId') categoryId: string) {
    return this.itemService.getItemByCategory(categoryId);
  }

  @ApiOperation({ summary: 'Gets Item by ID' })
  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  @ApiOperation({ summary: 'Creates a new Item' })
  @ApiBody({ type: CreateItemDto })
  @Post()
  async createItem(@Body() data: CreateItemDto) {
    return this.itemService.createItem(data);
  }

  @ApiOperation({ summary: 'Creates a new Item' })
  @ApiBody({ type: EditItemDto })
  @Put(':itemId')
  async editItem(@Param('itemId') itemId: string, @Body() data: EditItemDto) {
    return this.itemService.editItem(itemId, data);
  }

  @ApiOperation({ summary: 'Creates a new Item' })
  @ApiBody({ type: CreateItemDto })
  @Put(':itemId/set-image')
  async setItemImage(
    @Param('itemId') itemId: string,
    @Body() { imageURL }: SetItemImageDto,
  ) {
    return this.itemService.setItemImage(itemId, imageURL);
  }
}

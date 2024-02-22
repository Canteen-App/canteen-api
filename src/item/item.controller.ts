import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './item.dto';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @ApiOperation({ summary: 'Creates a new Item' })
  @ApiBody({ type: CreateItemDto })
  @Post()
  async createItem(@Body() data: CreateItemDto) {
    return this.itemService.createItem(data);
  }

  @ApiOperation({ summary: 'Gets Item by ID' })
  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }
}

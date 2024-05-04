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
import { ItemService } from './item.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto, EditItemDto, SetItemImageDto } from './item.dto';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';

@ApiTags('Item')
@Controller('item')
@UseGuards(FirebaseAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @ApiOperation({ summary: 'Gets Item with all data by ID' }) // Dashboard
  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  @ApiOperation({ summary: 'Get Todays Order for specific item' }) // Dashboard
  @Get(':id/today-orders')
  async getTodaysItemOrders(@Param('id') id: string) {
    return this.itemService.getTodaysItemOrders(id);
  }

  @ApiOperation({ summary: 'Gets Item Info by ID' }) // Ordering App
  @Get('info/:id')
  async getItemInfo(@Req() req, @Param('id') id: string) {
    return this.itemService.getItemInfo(req.user, id);
  }

  @ApiOperation({ summary: 'Gets Item by Category' })
  @Get('/category/:categoryId')
  async getItemsByCategory(@Param('categoryId') categoryId: string) {
    return this.itemService.getItemByCategory(categoryId);
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

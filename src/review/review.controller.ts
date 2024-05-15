import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './review.dto';

@ApiTags('Review')
@Controller('review')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Likes a item using item id and req.user' })
  @Get('like/:id')
  async likeItem(@Req() req, @Param('id') id: string) {
    return this.reviewService.likeItem(req.user, id);
  }

  @ApiOperation({ summary: 'Unlikes a item using item id and req.user' })
  @Get('unlike/:id')
  async unLikeItem(@Req() req, @Param('id') id: string) {
    return this.reviewService.unlikeItem(req.user, id);
  }

  @ApiOperation({ summary: 'Creates a new review for item' })
  @Post('feedback/:id')
  async makeReview(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviewService.makeReview(req.user, id, body);
  }
}

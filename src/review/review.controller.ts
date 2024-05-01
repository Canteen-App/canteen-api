import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/admin.guard';
import { ReviewService } from './review.service';

@Controller('review')
@UseGuards(FirebaseAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('like/:id')
  async likeItem(@Req() req, @Param('id') id: string) {
    return this.reviewService.likeItem(req.user, id);
  }

  @Get('unlike/:id')
  async unLikeItem(@Req() req, @Param('id') id: string) {
    return this.reviewService.unlikeItem(req.user, id);
  }
}

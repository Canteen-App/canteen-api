import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCustomerDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Gets Customer Profile' })
  @Get('/customer/:id')
  async getCustomerAccount(@Param('id') id: string) {
    return this.authService.getCustomerAccount(id);
  }

  @ApiOperation({ summary: 'Create Customer Account' })
  @Post('/customer')
  async createCustomerAccount(@Body() body: CreateCustomerDto) {
    return this.authService.createCustomerAccount(body);
  }
}

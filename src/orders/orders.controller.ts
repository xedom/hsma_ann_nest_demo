import {
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrder(req.user.sub, id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.sub, id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/return')
  async returnOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.returnOrder(req.user.sub, id);
  }
}

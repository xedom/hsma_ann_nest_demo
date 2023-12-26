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

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.sub);
  }

  @Get('/:id')
  async getOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrder(req.user.sub, id);
  }

  @Put('/:id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.sub, id);
  }

  @Put('/:id/return')
  async returnOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.returnOrder(req.user.sub, id);
  }
}

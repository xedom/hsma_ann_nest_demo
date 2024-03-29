import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ItemDto } from './dto/item.dto copy';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@Request() req) {
    return await this.cartService.findOne(req.user.sub);
  }

  @Post('items')
  async addItems(@Request() req, @Body() itemDto: ItemDto | ItemDto[]) {
    console.log('itemDto', itemDto);
    console.log('itemDto', req.user.sub);
    return this.cartService.addItems(
      req.user.sub,
      Array.isArray(itemDto) ? itemDto : [itemDto],
    );
  }

  @Put('items/:id')
  async updateCartItem(
    @Request() req,
    @Param('id') itemID: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(req.user.sub, itemID, updateCartDto);
  }

  @Delete('items/:id')
  async deleteCartItem(@Request() req, @Param('id') itemID: string) {
    return this.cartService.deleteCartItem(req.user.sub, itemID);
  }

  @Delete()
  async clearCart(@Request() req) {
    return this.cartService.clear(req.user.sub);
  }

  @Post('checkout')
  async checkout(@Request() req) {
    return this.cartService.checkout(req.user.sub);
  }
}

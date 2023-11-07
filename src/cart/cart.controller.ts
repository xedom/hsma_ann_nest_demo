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

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserCart(@Request() req) {
    return await this.cartService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('items')
  async findOne(@Request() req, @Body() itemDto: ItemDto | ItemDto[]) {
    return this.cartService.addItems(
      req.user.sub,
      Array.isArray(itemDto) ? itemDto : [itemDto],
    );
  }

  @UseGuards(AuthGuard)
  @Put('items/:id')
  async updateCartItem(
    @Request() req,
    @Param('id') itemID: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(req.user.sub, itemID, updateCartDto);
  }

  @UseGuards(AuthGuard)
  @Delete('items/:id')
  async deleteCartItem(@Request() req, @Param('id') itemID: string) {
    return this.cartService.deleteCartItem(req.user.sub, itemID);
  }

  @UseGuards(AuthGuard)
  @Post('items/checkout')
  async checkout(@Request() req) {
    return this.cartService.checkout(req.user.sub);
  }
}

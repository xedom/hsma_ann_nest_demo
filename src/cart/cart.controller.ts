import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Post,
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
  async getCart(@Request() req) {
    return await this.cartService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('items')
  findOne(@Request() req, @Body() itemDto: ItemDto | ItemDto[]) {
    console.log(req.user);
    return this.cartService.addItems(
      req.user.sub,
      Array.isArray(itemDto) ? itemDto : [itemDto],
    );
  }

  //gibt alle Carts von allen Usern zurück
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Put()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateCartDto){
    return this.cartService.update(id, updateUserDto);
  }
}

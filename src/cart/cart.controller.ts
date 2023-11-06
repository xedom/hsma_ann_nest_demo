import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cart = await this.cartService.findOne(req.user.sub);
    return cart;
  }

  @Post()
  create(@Body() createUserDto: CreateCartDto) {
    return this.cartService.create(createUserDto);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}

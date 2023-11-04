import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { AuthGuard } from '../auth/auth.guard';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    findAll() {
      return this.productsService.findAll();
    }
  
    @Get('search')
    findOneName(@Query('name') name: string) {
      return this.productsService.findOneName(name);
    }

    @Get(':_id')
    findOneId(@Param('_id') _id: string) {
      return this.productsService.findOneId(_id);
    }

    @Put(':product_id')
    async update(@Param('product_id') product_id: string, @Body() productData) {
      return this.productsService.update(product_id, productData);
    }

    @Post()
    create(@Body() productData) {
      console.log(productData);
      return this.productsService.create(productData);
    }
  
    @Delete(':product_id')
    async remove(@Param('product_id') product_id: string) {
      return this.productsService.remove(product_id);
    }
  
  }
  
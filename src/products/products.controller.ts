import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Redirect,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { HttpService } from '@nestjs/axios';
import { Types } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  findOneName(@Query('name') name: string) {
    return this.productsService.findOneName(name);
  }

  @Get('user/:userID')
  findByUser(@Param('userID') userID: string) {
    console.log('userID1', userID);
    return this.productsService.findByUser(userID);
  }

  @Get(':_id')
  findOneId(@Param('_id') _id: string) {
    return this.productsService.findOneId(_id);
  }

  @Put(':_id')
  async update(@Param('_id') _id: string, @Body() productData) {
    return this.productsService.update(_id, productData);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @Redirect()
  async create(@Request() req, @UploadedFile() image, @Body() body) {
    if (req.user.role !== 'vendor')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const productInfo = {
      ...body,
      userID: new Types.ObjectId(req.user.sub),
    };

    if (image) {
      const imageToUpload = {
        user: req.user.sub,
        mimetype: image.mimetype,
        buffer: image?.buffer.toString('base64'),
      };

      const { data } = await this.httpService
        .post('https://media.xed.im/upload', imageToUpload, {
          headers: { Authorization: `Bearer ${process.env.MEDIA_XED_TOKEN}` },
        })
        .toPromise();

      productInfo.images = [data.url];
    }

    await this.productsService.create(productInfo);

    return {
      message: 'User updated',
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL + '/products',
    };
  }

  @Delete(':_id')
  async remove(@Param('_id') _id: string) {
    return this.productsService.remove(_id);
  }
}

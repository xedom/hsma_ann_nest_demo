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
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { HttpService } from '@nestjs/axios';
import { Types } from 'mongoose';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/users/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';

// @UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly httpService: HttpService,
  ) {}

  // --- public ----------
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
    return this.productsService.findByUser(userID);
  }

  @Get(':id')
  findOneId(@Param('id') id: string) {
    return this.productsService.findOneId(id);
  }

  // --- vendors ----------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @Put(':id')
  async update(@Param('id') id: string, @Body() productData) {
    return this.productsService.update(id, productData);
  }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.VENDOR)
  @UseInterceptors(
    AnyFilesInterceptor(),
    // FileInterceptor(
    //   'files',
    // {
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, cb) => {
    //       // Generating a 32 random chars long string
    //       const randomName = Array(32)
    //         .fill(null)
    //         .map(() => Math.round(Math.random() * 16).toString(16))
    //         .join('');
    //       //Calling the callback passing the random name generated with the original extension name
    //       cb(null, `${randomName}${extname(file.originalname)}`);
    //     },
    //   }),
    // }
    // ),
  )
  @Post('/test')
  async create2(@Request() req, @UploadedFiles() files, @Body() body) {
    // if (req.user.role !== 'vendor')
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log('image----');
    console.log('image', files);

    const productInfo = {
      ...body,
      userID: new Types.ObjectId(req.user.sub),
    };

    return { message: 'User updated' };

    // upload image to media.xed.im
    if (files) {
      const imageToUpload = {
        user: req.user.sub,
        mimetype: files.mimetype,
        buffer: files?.buffer.toString('base64'),
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @UseInterceptors(FileInterceptor('image'))
  @Redirect()
  @Post()
  async create(@Request() req, @UploadedFile() image, @Body() body) {
    if (req.user.role !== 'vendor')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const productInfo = {
      ...body,
      userID: new Types.ObjectId(req.user.sub),
    };

    // upload image to media.xed.im
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

  // --- admins ----------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @Delete(':_id')
  async remove(@Request() req, @Param('_id') _id: string) {
    if (req.user.role === UserRole.VENDOR)
      return this.productsService.removeAsUser(req.user.sub, _id);

    return this.productsService.remove(_id);
  }
}

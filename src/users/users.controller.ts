import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Redirect,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { UserRole } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.usersService.getProfile(req.user.sub);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: { role: UserRole },
  ) {
    if (req.user.role !== UserRole.ADMIN || req.user.sub === id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id') // TODO: add auth guard - only admin can delete users
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log('remove user', req.user);
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('settings')
  @UseInterceptors(FileInterceptor('image'))
  @Redirect()
  async uploadFile(@Request() req, @UploadedFile() image, @Body() body) {
    const base64Image: string = image?.buffer.toString('base64');
    const userInfo = body;

    const imageToUpload = {
      user: req.user.sub,
      mimetype: image.mimetype,
      buffer: base64Image,
    };

    const { data } = await this.httpService
      .post('https://media.xed.im/upload', imageToUpload, {
        headers: { Authorization: `Bearer ${process.env.MEDIA_XED_TOKEN}` },
      })
      .toPromise();

    const { url } = data;

    this.usersService.updateProfile(req.user.sub, {
      ...userInfo,
      profilePic: url,
    });

    return {
      message: 'User updated',
      image: base64Image,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL + '/settings',
    };
  }
}

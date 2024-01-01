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
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

// @UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(RolesGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @UseGuards(RolesGuard)
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @UseGuards(RolesGuard)
  @Get('id/:userID')
  getUserByID(@Param('userID') userID: string) {
    return this.usersService.getUserByID(userID);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post('settings')
  @UseInterceptors(FileInterceptor('image'))
  @Redirect()
  async uploadFile(@Request() req, @UploadedFile() image, @Body() body) {
    const userInfo = body;

    // uploading the image to media.xed.im
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

      userInfo.picture = data.url;
    }

    this.usersService.updateProfile(req.user.sub, userInfo);

    return {
      message: 'User updated',
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL + '/settings',
    };
  }

  // --- admins ----------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: { role: UserRole }) {
    console.log('update user', id, dto);
    return this.usersService.update(id, dto);
  }

  // --- special permissions ----------
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id') // TODO: add auth guard - only admin can delete users
  remove(@Request() req, @Param('id') id: string) {
    const isSelf = req.user.sub === id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    if (!(isAdmin || isSelf))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log('remove user', req.user);
    return this.usersService.remove(id);
  }
}

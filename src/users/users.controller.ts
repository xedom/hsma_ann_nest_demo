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
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.usersService.getProfile(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userID = req.user.sub;
    return this.usersService.updateProfile(userID, updateProfileDto);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // @UseGuards(AuthGuard)
  // @Put(':id')
  // update(
  //   @Request() req,
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   console.log('update user', req.user);
  //   return this.usersService.update(id, updateUserDto);
  // }

  @UseGuards(AuthGuard)
  @Delete(':id') // TODO: add auth guard - only admin can delete users
  remove(@Request() req, @Param('id') id: string) {
    console.log('remove user', req.user);
    return this.usersService.remove(id);
  }

  @Post('settings') // TODO: work in progress
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image, @Body() body) {
    const base64Image: string = image?.buffer.toString('base64');
    const userInfo = body;
    console.log('base64Image', base64Image);
    console.log('userInfo', userInfo);

    if (!image) {
      throw new HttpException(
        'TEST error: image is null',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      statusCode: 200,
      message: 'User updated',
      image: base64Image,
    };
  }
}

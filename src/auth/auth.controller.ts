import type { User } from '@app/common/entities';
import { TApiResponseAsync } from '@app/common/types';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() reigsterUserDto: RegisterUserDto): TApiResponseAsync<User> {
    await this.authService.registerUser(reigsterUserDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
    };
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): TApiResponseAsync<User> {
    const user = await this.authService.loginUser(loginUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'User retrived successfully',
      data: user,
    };
  }
}

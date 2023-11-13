import type { User } from '@app/common/entities';
import { Injectable } from '@nestjs/common';

import type { LoginUserDto, RegisterUserDto } from './dtos';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    return await this.userService.create(registerUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.read(loginUserDto);
    return user;
  }
}

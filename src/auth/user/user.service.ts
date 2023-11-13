import { User } from '@app/common/entities';
import type { ICrudService } from '@app/common/interfaces';
import type { TPaginatedResource, TQuery } from '@app/common/types';
import { BadRequestException, Injectable } from '@nestjs/common';

import type { LoginUserDto, RegisterUserDto } from '../dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService implements ICrudService<User> {
  constructor(private readonly userRepository: UserRepository) {}

  list(query: TQuery<User>): Promise<TPaginatedResource<User>> {
    throw new Error('Method not implemented.');
  }

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const user = new User(registerUserDto);
    const cUser = await this.userRepository.create(user);
    return cUser;
  }

  async read(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      email: loginUserDto.email,
    });

    if (user.password !== loginUserDto.password) {
      throw new BadRequestException(`Invalid credentials`);
    }

    return user;
  }

  update(id: number, updateDto: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

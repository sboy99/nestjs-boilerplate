import { User } from '@app/common/entities';
import type { ICrudService } from '@app/common/interfaces';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import type { LoginUserDto, RegisterUserDto } from '../dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService implements ICrudService<User> {
  protected readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const user = new User(registerUserDto);
    const cUser = await this.userRepository.create(user);

    this.logger.log(`User created ${JSON.stringify(cUser)}`);

    return cUser;
  }

  async list(where?: Partial<User>): Promise<User[]> {
    const users = await this.userRepository.list(
      { ...where },
      {
        relations: {
          tasks: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          tasks: {
            id: true,
            taskName: true,
            prority: true,
          },
        },
      }
    );

    return users;
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

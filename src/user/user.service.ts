import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO, LoginDTO, UserRO } from '../auth/auth.dto';
import { ThirdPartyProvider } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAllUsers(): Promise<UserRO[]> {
    const users = await this.userRepository.find();
    return users.map((user): UserRO => user.toResponseObject());
  }

  async findByLogin(loginDTO: LoginDTO): Promise<UserRO> {
    const { email, password } = loginDTO;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new BadRequestException('Invalid username/password');
    }

    return user.toResponseObject();
  }

  async create(data: RegisterDTO): Promise<UserRO> {
    const { email } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async findOrCreateByThirdPartyId(
    email: string,
    thirdPartyId: string,
    provider: ThirdPartyProvider, //@todo: add other oauth options
  ): Promise<UserRO> {
    const googleObj = {
      id: thirdPartyId,
      email: email,
    };

    let user = await this.userRepository.findOne({
      where: { google: googleObj },
    });

    if (user) {
      return user.toResponseObject();
    }

    user = await this.userRepository.create({
      email: email,
      google: googleObj,
    });
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}

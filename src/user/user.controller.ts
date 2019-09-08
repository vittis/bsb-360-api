import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from '../auth/auth.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  showAllUsers(): Promise<UserRO[]> {
    return this.userService.showAllUsers();
  }
}

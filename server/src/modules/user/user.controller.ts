import { JwtAuthGuard } from './../../guards/auth.guard';
import { User } from 'src/models/user.model';
import { LoggedInUser } from './../../decorators/logged-in-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public getLoggedInUser(@LoggedInUser() user: User): User {
    return user;
  }
}

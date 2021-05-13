import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/models/user.model';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    super({
      jwtFromRequest: (request: Request): string => {
        if (request && request.cookies) {
          return request.cookies.accessToken;
        }
        return null;
      },

      ignoreExpiration: false,
      secretOrKey: 'secret',
    });

    this.userService = userService;
  }

  async validate(payload: { email: string }): Promise<User> {
    return await this.userService.findOneUserByEmailAddress(payload.email);
  }
}

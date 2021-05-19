import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/models/user.model';
import { UserService } from 'src/modules/user/user.service';

/**
 * Implementation for the JWT Authentication Strategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Injected User Service.
  private readonly userService: UserService;

  /**
   * Constructor used to define the JWT Extraction Strategy.
   * @param userService Injected User Service from the NestJS Context.
   */
  constructor(userService: UserService) {
    /**
     * Custom method for extraction of JWT Token from cookies.
     * @param request Express Request Type. Holds information for the incoming request.
     * @returns JWT Token or null
     */
    const fromCookies = (request: Request): string => {
      if (request && request.cookies) {
        return request.cookies.accessToken;
      }
      return null;
    };

    // Setting up the extraction technique for the JWT Token.
    super({
      jwtFromRequest: fromCookies,
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });

    // Accepting the injected User Service.
    this.userService = userService;
  }

  /**
   * Returns decoded payload.
   * @param payload JWT Payload consisting of user email address
   * @returns User
   */
  async validate(payload: any): Promise<User> {
    return await this.userService.findOneUserByEmailAddress(payload.email);
  }
}

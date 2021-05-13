import { Request, Response } from 'express';
import { AuthService } from './../modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  private async validateCookies(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const accessToken = request.cookies.accessToken;

    try {
      await this.authService.jwtVerify(accessToken);
      const decodedPayload = this.authService.jwtDecode(accessToken);
      const { email, accessTimeLimit, refreshTimeLimit } = decodedPayload;

      const now = new Date();
      const accessTime = new Date(accessTimeLimit);
      const refreshTime = new Date(refreshTimeLimit);

      if (now.getTime() > accessTime.getTime()) {
        if (now.getTime() > refreshTime.getTime()) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        } else {
          const newAccessToken = this.authService.jwtSign(
            {
              email: email,
              accessTimeLimit: this.authService.getFifteenMinutesLater(),
              refreshTimeLimit: this.authService.getSevenDaysLater(),
            },
            '7d',
          );
          response.cookie('accessToken', newAccessToken, {
            sameSite: 'strict',
            httpOnly: true,
          });

          request.user = this.authService.findUserByEmailAddress(email);
          return true;
        }
      } else {
        request.user = this.authService.findUserByEmailAddress(email);
        return true;
      }
    } catch (error) {
      response.clearCookie('accessToken');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    return await this.validateCookies(request, response);
  }
}

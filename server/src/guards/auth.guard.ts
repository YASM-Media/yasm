import { Request, Response } from 'express';
import { AuthService } from './../modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * A Custom API Guard to check if the user is authenticated to use the API or not.
 * Choice of Authentication: Cookie based Token Authentication.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /**
   * Method to validate the cookies the user sends while requesting for resource.
   * @param request Express Request Type. Holds details on incoming request
   * @param response Express Response Type. Holds information that can be sent to the user
   * @returns Boolean, if the user is authenticated or not.
   * @throws HttpException, if the user unauthenticated to request the resource.
   */
  private async validateCookies(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    // Fetch the accessToken from the cookies.
    const accessToken = request.cookies.accessToken;

    try {
      // Try and verify the cookie. Throws an error if the cookie is not verifiable.
      await this.authService.jwtVerify(accessToken);

      // Decode and obtain the payload from the JWT Token.
      const decodedPayload = this.authService.jwtDecode(accessToken);
      const { email, accessTimeLimit, refreshTimeLimit } = decodedPayload;

      // Get the timestamp of request to compare against those of the cookie.
      const now = new Date();
      const accessTime = new Date(accessTimeLimit);
      const refreshTime = new Date(refreshTimeLimit);

      // CASE 1: If the cookie is sent after access time limit.
      if (now.getTime() > accessTime.getTime()) {
        // CASE 1A: If the cookie is sent after refresh time limit.
        if (now.getTime() > refreshTime.getTime()) {
          // Throw an unauthorised error to the user.
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        } else {
          // CASE 1B: If the cookie is sent before the refresh time limit,
          // send a new JWT token to the user.
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

          // Set the user parameter of the request as the logged in user.
          request.user = this.authService.findUserByEmailAddress(email);
          return true;
        }
      } else {
        // CASE 2: If the cookie is sent within the access time.
        // Set the user parameter of the request as the logged in user.
        request.user = this.authService.findUserByEmailAddress(email);
        return true;
      }
    } catch (error) {
      // If the JWT Token is not verifiable, clear the current cookie and
      // throw a new HttpException for unauthorised access.
      response.clearCookie('accessToken');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Implementation for the Guard to check and validate the cookies on request.
   * @param context ExecutionContext Object containing all the information of the context of the request.
   * @returns Boolean, if the request can be processed or has to be blocked
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request and response objects from the context.
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    // Call the method which validates the sent in cookies.
    return await this.validateCookies(request, response);
  }
}

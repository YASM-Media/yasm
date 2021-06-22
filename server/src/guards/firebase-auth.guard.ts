import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import admin from 'src/utils/firebase-admin';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  private async validateAuthenticationHeader(
    request: Request,
  ): Promise<boolean> {
    try {
      if (
        request.headers.authorization &&
        request.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        const authToken = request.headers.authorization.split(' ')[1];

        const firebaseUser = await admin.auth().verifyIdToken(authToken);

        request.user = this.userService.findOneUserById(firebaseUser.uid);
        return true;
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.validateAuthenticationHeader(
      context.switchToHttp().getRequest(),
    );
  }
}

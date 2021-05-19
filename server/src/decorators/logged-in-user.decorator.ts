import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Fetches the currently logged in user
 * from the request context
 */
export const LoggedInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

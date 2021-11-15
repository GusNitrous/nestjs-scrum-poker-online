import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Http current user id param decorator.
 * Extracts a object of current user from data property of the http request.
 */
export const CurrentUserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
});

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Http current user param decorator.
 * Extracts an object of the current user from data property of the http request.
 */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
});

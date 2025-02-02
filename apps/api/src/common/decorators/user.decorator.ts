import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '@shared/types';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!data) return request.user;

  return request.user[data] as IJwtPayload;
});

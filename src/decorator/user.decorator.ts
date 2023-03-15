import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => {
  return data ? req.args[0].user && req.args[0].user[data] : req.args[0].user;
});

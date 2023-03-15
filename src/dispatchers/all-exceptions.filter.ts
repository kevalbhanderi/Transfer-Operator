import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { getObject } from 'src/modules/database/database.provider';
import { DbDocKeys } from '../config/constants';
import { getValidationMessages } from '../utils/language.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    console.log('exception : ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // fetch headers from request
    const headers = ctx.getRequest<Request>().headers;
    const accessToken = headers['x-access-token'];
    const sessionTokenDoc = await getObject(`${accessToken}${DbDocKeys.TOKEN}`);
    let language: string;
    // if header has valid accessToken, fetch user data to get user language preference
    if (sessionTokenDoc) {
      const user = await getObject(
        `${sessionTokenDoc.user_id}${DbDocKeys.USER}`,
      );
      if (user) {
        language = user.language;
      }
    }
    // get error status code
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    if (exception.message.message && exception.message.data) {
      return response.status(status).json({
        isError: true,
        message:
          getValidationMessages(language)[exception.message.message] ||
          exception.message.message ||
          'Internal server error',
        data: exception.message.data,
      });
    }

    return response.status(status).json({
      isError: true,
      message:
        getValidationMessages(language)[exception.message] ||
        exception.message ||
        'Internal server error',
      data: {},
    });
  }
}

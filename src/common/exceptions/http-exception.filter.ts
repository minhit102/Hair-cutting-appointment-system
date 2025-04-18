// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { configEnv } from '../config/config';
// import { GoogleChatService } from 'src/common/services/google-chat.service';
// import { ERROR_MESSAGE } from '../constants/error-code';

// const { googleChat } = configEnv;

// @Catch()
// export class AllExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionFilter.name);

//   async catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const response = ctx.getResponse<Response>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let errorMessage = exception?.response || ERROR_MESSAGE.DEFAULT;
//     const realIp =
//       request.headers['x-real-ip'] || request.headers['x-forwarded-for'];

//     if (exception instanceof HttpException) {
//       this.logger.error(
//         `[${realIp ? realIp : request.ip}]Error ${request.method} ${
//           request.originalUrl
//         } \n ${JSON.stringify(errorMessage)}`,
//       );

//       status = exception.getStatus();
//     } else if (exception.name === 'ValidatorError') {
//       errorMessage = exception.message;
//       status = HttpStatus.BAD_REQUEST;
//     } else if (exception instanceof Error) {
//       errorMessage = ERROR_MESSAGE.DEFAULT;
//       this.logger.error(exception);
//       this.sendWebhook(
//         `[${realIp ? realIp : request.ip}]Error ${request.method} ${
//           request.originalUrl
//         } \n ${exception.stack.toString()}`,
//       );
//     }

//     return response.status(status).json({
//       meta: -1,
//       status: status,
//       error: errorMessage,
//       timestamp: new Date().toISOString(),
//     });
//   }

//   async sendWebhook(error: any) {
//     try {
//       if (googleChat.enable && googleChat.url) {
//         const googleChatInstance = GoogleChatService.getInstance();
//         googleChatInstance.webhookError(error);
//       }
//     } catch (error) {
//       console.log('error :>> ', error);
//     }
//   }
// }

import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

const customBadRequestSchema = {
  example: {
    message: ['email must be an email'],
    error: 'Bad Request',
    statusCode: 400,
  },
};

export function CustomApiBadRequest(description: string, message: string) {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        example: {
          message: [message],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      description: description,
    }),
  );
}

export function CustomForbiddenException(description: string, message: string) {
  return applyDecorators(
    ApiForbiddenResponse({
      schema: {
        example: {
          message: message,
          error: 'Forbidden',
          statusCode: 403,
        },
      },
      description: description,
    }),
  );
}

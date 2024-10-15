/* eslint-disable indent */
import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
    async handleError(error: any, message?: string): Promise<never> {
        console.error('Error:', error);

        switch (true) {
            case error instanceof HttpException:
                throw error;

            case error instanceof BadRequestException:
                throw new BadRequestException({
                    message: message || 'Bad request',
                    error: error.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            case error instanceof InternalServerErrorException:
                throw new InternalServerErrorException({
                    message: message || 'Internal server error',
                    error: error.message,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                });

            case error.code === 'P2002':
                throw new HttpException(
                    {
                        message: message || 'Duplicate entry',
                        error: error.message,
                        statusCode: HttpStatus.CONFLICT,
                    },
                    HttpStatus.CONFLICT,
                );

            default:
                throw new InternalServerErrorException({
                    message: message || 'Unexpected error occurred',
                    error: error.message,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                });
        }
    }
}

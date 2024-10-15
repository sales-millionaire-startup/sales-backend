/* eslint-disable indent */
import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
    private readonly logger = new Logger(ErrorService.name);

    async handleError(error: any, message?: string): Promise<never> {
        this.logger.error(`Error occurred: ${error.message}`, error.stack);

        switch (true) {
            case error instanceof HttpException:
                throw error;

            case error instanceof BadRequestException:
                this.logger.warn(`Bad request: ${error.message}`);
                throw new BadRequestException({
                    message: message || 'Bad request',
                    error: error.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            case error instanceof InternalServerErrorException:
                this.logger.error(
                    `Internal server error: ${error.message}`,
                    error.stack,
                );
                throw new InternalServerErrorException({
                    message: message || 'Internal server error',
                    error: error.message,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                });

            case error.code === 'P2002':
                this.logger.warn(`Duplicate entry: ${error.message}`);
                throw new HttpException(
                    {
                        message: message || 'Duplicate entry',
                        error: error.message,
                        statusCode: HttpStatus.CONFLICT,
                    },
                    HttpStatus.CONFLICT,
                );

            default:
                this.logger.error(
                    `Unexpected error: ${error.message}`,
                    error.stack,
                );
                throw new InternalServerErrorException({
                    message: message || 'Unexpected error occurred',
                    error: error.message,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                });
        }
    }
}

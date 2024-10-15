import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/common/roles.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { UserService } from '../services/user.service';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { ErrorService } from 'src/core/error/error.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private errorService: ErrorService,
    ) {}

    @Get('')
    @Roles(Role.BUYER, Role.ADMIN)
    async getUser(@CurrentUser() user: User): Promise<any> {
        try {
            return await this.userService.getUser(user.id);
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to get user information',
            );
        }
    }
}

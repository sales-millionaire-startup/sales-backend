import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/common/roles.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { UserService } from '../services/user.service';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @Roles(Role.BUYER, Role.ADMIN)
    async getUser(@CurrentUser() user: User): Promise<any> {
        return await this.userService.getUser(user.id);
    }
}

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoginDto } from '../models/login.dto';
import { AuthDto } from '../models/auth.dto';
import { AuthService } from '../services/auth.service';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ErrorService } from 'src/core/error/error.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly errorService: ErrorService,
    ) {}

    @Post('register')
    async register(@Body() data: AuthDto): Promise<any> {
        try {
            return await this.authService.register(data);
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Post('create-admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createAdmin(
        @Body() data: AuthDto,
        @CurrentUser() user: User,
    ): Promise<any> {
        try {
            return await this.authService.createAdmin(data, user);
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<any> {
        try {
            return await this.authService.login(dto);
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }
}

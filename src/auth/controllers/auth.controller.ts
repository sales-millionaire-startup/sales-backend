// auth/auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoginDto } from '../models/login.dto';
import { AuthDto } from '../models/auth.dto';
import { AuthService } from '../services/auth.service';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() data: AuthDto) {
        return this.authService.register(data);
    }

    @Post('create-admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createAdmin(@Body() data: AuthDto, @CurrentUser() user: User) {
        return this.authService.createAdmin(data, user);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}

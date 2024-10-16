// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService

import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1w' },
            }),
        }),
        ConfigModule, // Import ConfigModule to handle environment variables
    ],
    providers: [AuthService, JwtStrategy, ErrorService],
    controllers: [AuthController],
})
export class AuthModule {}

// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        try {
            const user = await this.authService.validateUser(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found or inactive');
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException({
                message: 'Invalid token or unauthorized access',
                statusCode: 401,
            });
        }
    }
}

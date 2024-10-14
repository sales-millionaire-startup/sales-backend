/* eslint-disable indent */
import { Role } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class AuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role; // Role is optional and can be set by admins
}

/* eslint-disable indent */
import { IsOptional, IsString } from 'class-validator';

export class UnitElementCreateInput {
    @IsOptional()
    @IsString()
    name_en?: string | null;

    @IsOptional()
    @IsString()
    name_ge?: string | null;

    @IsOptional()
    @IsString()
    name_tr?: string | null;
}

export class UnitElementUpdateInput {
    @IsOptional()
    @IsString()
    name_en?: string | null;

    @IsOptional()
    @IsString()
    name_ge?: string | null;

    @IsOptional()
    @IsString()
    name_tr?: string | null;
}

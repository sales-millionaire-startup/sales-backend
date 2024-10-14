/* eslint-disable indent */
import { IsString } from 'class-validator';

export class UnitElementCreateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;
}

export class UnitElementUpdateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;
}

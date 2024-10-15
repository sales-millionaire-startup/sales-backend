import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UnitElementService } from '../services/unitElement.service';
import {
    UnitElementCreateInput,
    UnitElementUpdateInput,
} from '../models/unitElement.models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { RolesGuard } from 'src/core/common/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('unit-element')
export class UnitElementController {
    constructor(private unitElementService: UnitElementService) {}

    @Get('')
    async getAllUnitElements(): Promise<any> {
        return await this.unitElementService.getAllUnit();
    }

    @Post('')
    @Roles(Role.ADMIN)
    async createUnitElement(
        @Body() unitElementCreateInput: UnitElementCreateInput,
    ): Promise<any> {
        return await this.unitElementService.createUnitElement(
            unitElementCreateInput,
        );
    }

    @Put(':unitElementId')
    async updateUnitElement(
        @Param('unitElementId', new ParseIntPipe()) unitElementId: number,
        @Body() unitElementUpdateInput: UnitElementUpdateInput,
    ): Promise<any> {
        return await this.unitElementService.updateUnitElement(
            unitElementUpdateInput,
            unitElementId,
        );
    }

    @Delete(':unitElementId')
    @Roles(Role.ADMIN)
    async deleteUnitElement(
        @Param('unitElementId', new ParseIntPipe()) unitElementId: number,
    ): Promise<any> {
        return await this.unitElementService.deleteUnitElement(unitElementId);
    }
}

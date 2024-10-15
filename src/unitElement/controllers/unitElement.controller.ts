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
import { ErrorService } from 'src/core/error/error.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('unit-element')
export class UnitElementController {
    constructor(
        private unitElementService: UnitElementService,
        private errorService: ErrorService,
    ) {}

    @Get('')
    async getAllUnitElements(): Promise<any> {
        try {
            return await this.unitElementService.getAllUnit();
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to get all unit elements',
            );
        }
    }

    @Post('')
    @Roles(Role.ADMIN)
    async createUnitElement(
        @Body() unitElementCreateInput: UnitElementCreateInput,
    ): Promise<any> {
        try {
            return await this.unitElementService.createUnitElement(
                unitElementCreateInput,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to create unit element',
            );
        }
    }

    @Put(':unitElementId')
    async updateUnitElement(
        @Param('unitElementId', new ParseIntPipe()) unitElementId: number,
        @Body() unitElementUpdateInput: UnitElementUpdateInput,
    ): Promise<any> {
        try {
            return await this.unitElementService.updateUnitElement(
                unitElementUpdateInput,
                unitElementId,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to update unit element',
            );
        }
    }

    @Delete(':unitElementId')
    @Roles(Role.ADMIN)
    async deleteUnitElement(
        @Param('unitElementId', new ParseIntPipe()) unitElementId: number,
    ): Promise<any> {
        try {
            return await this.unitElementService.deleteUnitElement(
                unitElementId,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to delete unit element',
            );
        }
    }
}

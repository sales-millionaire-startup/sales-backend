import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PurchaseRequestService } from '../services/purchaseRequest.service';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { Roles } from 'src/core/common/roles.decorator';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { PurchaseRequestUpdateInput } from '../models/purchaseRequest.models';
import { ErrorService } from 'src/core/error/error.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchaseRequest')
export class PurchaseRequestController {
    constructor(
        private purchaseRequestService: PurchaseRequestService,
        private errorService: ErrorService,
    ) {}

    @Get('')
    @Roles(Role.ADMIN, Role.BUYER)
    async getPurchaseRequests(@CurrentUser() user: User): Promise<any> {
        try {
            return await this.purchaseRequestService.getPurchaseRequests(
                user.id,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to get purchase requests',
            );
        }
    }

    @Post('')
    @Roles(Role.ADMIN, Role.BUYER)
    async createPurchaseRequest(@CurrentUser() user: User): Promise<any> {
        try {
            return await this.purchaseRequestService.createPurchaseRequest(
                user.id,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to create purchase request',
            );
        }
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.BUYER)
    async updatePurchaseRequest(
        @Param('id') id: number,
        @Body() purchaseRequestUpdateInput: PurchaseRequestUpdateInput,
    ): Promise<any> {
        try {
            return await this.purchaseRequestService.updatePurchaseRequest(
                id,
                purchaseRequestUpdateInput,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to update purchase request',
            );
        }
    }
}

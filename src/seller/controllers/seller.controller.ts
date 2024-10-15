import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { SellerCategoryInput, SellerInfoInput } from '../models/seller.model';
import { Roles } from 'src/core/common/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/core/common/roles.guard';
import { SellerService } from '../services/seller.service';
import { ErrorService } from 'src/core/error/error.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('seller')
export class SellerController {
    constructor(
        private sellerService: SellerService,
        private errorService: ErrorService,
    ) {}

    @Get(':id')
    @Roles(Role.SELLER, Role.ADMIN)
    async getSellerInfo(
        @Param('id', new ParseIntPipe()) id: number,
    ): Promise<any> {
        try {
            return await this.sellerService.getSellerInfo(id);
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to retrieve seller info',
            );
        }
    }

    @Post('category')
    @Roles(Role.SELLER, Role.ADMIN)
    async setSellingCategories(
        @Body() sellerCategoryInput: SellerCategoryInput,
    ): Promise<any> {
        try {
            return await this.sellerService.setSellingCategories(
                sellerCategoryInput,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to set selling categories',
            );
        }
    }

    @Put(':id')
    @Roles(Role.SELLER, Role.ADMIN)
    async updateSellerInfo(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() sellerInfoInput: SellerInfoInput,
    ): Promise<any> {
        try {
            return await this.sellerService.updateSellerInfo(
                sellerInfoInput,
                id,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to update seller info',
            );
        }
    }
}

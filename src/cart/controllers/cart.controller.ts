import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { ErrorService } from 'src/core/error/error.service';
import {
    CartItemCreateInput,
    CartItemUpdateInput,
} from '../models/cart.models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from 'src/core/parser/parse-json.pipe';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/core/common/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
        private errorService: ErrorService,
    ) {}

    @Get(':cartId')
    @Roles(Role.BUYER, Role.ADMIN)
    async getCartItems(
        @Param('cartId', new ParseIntPipe()) cartId: number,
    ): Promise<any> {
        try {
            return await this.cartService.getCartItems(cartId);
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to get cart items',
            );
        }
    }

    @Post('')
    @Roles(Role.BUYER, Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async addCartItem(
        @UploadedFile() file,
        @Body() cartItemCreateInput: CartItemCreateInput,
    ): Promise<any> {
        try {
            return await this.cartService.addCartItem(
                cartItemCreateInput,
                file,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to add cart item',
            );
        }
    }

    @Put(':cartItemId')
    @Roles(Role.BUYER, Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageForCartItem(
        @UploadedFile() file,
        @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
        @Body('data', ParseJsonPipe) cartItemUpdateInput: CartItemUpdateInput,
    ): Promise<any> {
        try {
            return await this.cartService.updateCartItem(
                cartItemId,
                cartItemUpdateInput,
                file,
            );
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to update cart item',
            );
        }
    }

    @Delete(':cartId/:cartItemId')
    @Roles(Role.BUYER, Role.ADMIN)
    async removeCartItem(
        @Param('cartId', new ParseIntPipe()) cartId: number,
        @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
    ): Promise<any> {
        try {
            return await this.cartService.removeCartItem(cartId, cartItemId);
        } catch (error) {
            return await this.errorService.handleError(
                error,
                'Failed to remove cart item',
            );
        }
    }
}

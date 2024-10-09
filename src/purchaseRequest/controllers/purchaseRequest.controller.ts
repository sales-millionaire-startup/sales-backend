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
@Controller('api/purchaseRequest')
export class PurchaseRequestController {
  constructor(private purchaseRequestService: PurchaseRequestService) {}

  @Get('')
  @Roles(Role.ADMIN, Role.BUYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPurchaseRequests(@CurrentUser() user: User): Promise<any> {
    return await this.purchaseRequestService.getPurchaseRequests(user.id);
  }

  @Post('')
  @Roles(Role.ADMIN, Role.BUYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createPurchaseRequest(@CurrentUser() user: User): Promise<any> {
    return await this.purchaseRequestService.createPurchaseRequest(user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.BUYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePurchaseRequest(
    @Param('id') id: number,
    @Body() purchaseRequestUpdateInput: PurchaseRequestUpdateInput,
  ): Promise<any> {
    return await this.purchaseRequestService.updatePurchaseRequest(
      id,
      purchaseRequestUpdateInput,
    );
  }
}

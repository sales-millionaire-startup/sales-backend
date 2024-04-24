import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UnitElementService } from '../services/unitElement.service';
import {
  UnitElementCreateInput,
  UnitElementUpdateInput,
} from '../models/unitElement.models';

@Controller('api/unit-element')
export class UnitElementController {
  constructor(private unitElementService: UnitElementService) {}

  @Get('')
  async getAllUnitElements(): Promise<any> {
    return await this.unitElementService.getAllUnit();
  }

  @Post('')
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
  async deleteUnitElement(
    @Param('unitElementId', new ParseIntPipe()) unitElementId: number,
  ): Promise<any> {
    return await this.unitElementService.deleteUnitElement(unitElementId);
  }
}

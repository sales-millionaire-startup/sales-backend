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
import { UnitService } from '../services/unit.service';
import { UnitCreateInput, UnitUpdateInput } from '../models/unit.model';

@Controller('api/unit')
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get('')
  async getAll(): Promise<any> {
    return await this.unitService.getAll();
  }

  @Post('')
  async createCategory(@Body() unitCreateInput: UnitCreateInput): Promise<any> {
    return await this.unitService.createSingleUnit(unitCreateInput);
  }

  @Put(':unitId')
  async updateModule(
    @Param('unitId', new ParseIntPipe()) unitId,
    @Body() unitUpdateInput: UnitUpdateInput,
  ): Promise<any> {
    return await this.unitService.updateSingleUnit(unitUpdateInput, unitId);
  }

  @Delete(':unitId')
  async deleteUnit(@Param('unitId', new ParseIntPipe()) unitId): Promise<any> {
    return await this.unitService.deleteUnit(unitId);
  }
}

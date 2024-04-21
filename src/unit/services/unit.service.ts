import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UnitCreateInput, UnitUpdateInput } from '../models/unit.model';

Injectable();
export class UnitService {
  private readonly prisma: PrismaService;

  constructor(private prismaClient: PrismaService) {
    this.prisma = prismaClient;
    //this.prisma = prismaClient.getClient();
  }

  async createSingleUnit(unitCreateInput: UnitCreateInput) {
    return await this.prisma.unit.create({
      data: {
        name_en: unitCreateInput.name_en,
        name_ge: unitCreateInput.name_ge,
        name_tr: unitCreateInput.name_tr,
      },
    });
  }

  async updateSingleUnit(unitUpdateInput: UnitUpdateInput, unitId) {
    return await this.prisma.unit.update({
      where: {
        id: unitId,
      },
      data: {
        name_en: unitUpdateInput.name_en,
        name_ge: unitUpdateInput.name_ge,
        name_tr: unitUpdateInput.name_tr,
      },
    });
  }

  async getAll() {
    return await this.prisma.unit.findMany();
  }

  async deleteUnit(unitId) {
    const randomSpec = await this.prisma.specification.findFirst({
      where: {
        unitId: unitId,
      },
    });

    if (!randomSpec) {
      await this.prisma.unit.delete({
        where: {
          id: unitId,
        },
      });
    }
  }
}

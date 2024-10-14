import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    UnitElementCreateInput,
    UnitElementUpdateInput,
} from '../models/unitElement.models';

@Injectable()
export class UnitElementService {
    constructor(private prisma: PrismaService) {}

    async getAllUnit() {
        return await this.prisma.unitElement.findMany();
    }

    async createUnitElement(unitElementCreateInput: UnitElementCreateInput) {
        return await this.prisma.unitElement.create({
            data: {
                name_en: unitElementCreateInput.name_en,
                name_ge: unitElementCreateInput.name_ge,
                name_tr: unitElementCreateInput.name_tr,
            },
        });
    }

    async updateUnitElement(
        unitElementUpdateInput: UnitElementUpdateInput,
        unitElementId: number,
    ) {
        return await this.prisma.unitElement.update({
            where: {
                id: unitElementId,
            },
            data: {
                name_en: unitElementUpdateInput.name_en,
                name_ge: unitElementUpdateInput.name_ge,
                name_tr: unitElementUpdateInput.name_tr,
            },
        });
    }

    async deleteUnitElement(unitElementId: number) {
        const specifications = await this.prisma.specification.findFirst({
            where: {
                unitElementId: unitElementId,
            },
        });

        if (!specifications) {
            return await this.prisma.unitElement.delete({
                where: {
                    id: unitElementId,
                },
            });
        }
    }
}

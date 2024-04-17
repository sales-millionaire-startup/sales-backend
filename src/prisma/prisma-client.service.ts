import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaClientService {
  private readonly extendedPrismaClient;
  constructor() {}

  getClient() {
    return this.extendedPrismaClient;
  }
}

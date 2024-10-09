import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { UnitElementModule } from './unitElement/unitElement.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { PurchaseRequestModule } from './purchaseRequest/purchaseRequest.module';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    ProductModule,
    UnitElementModule,
    PrismaModule,
    CartModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PurchaseRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

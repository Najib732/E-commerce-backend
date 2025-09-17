import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller.entity';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Product } from '../product/product.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Seller,Product])],
  providers: [SellerService],
  controllers: [SellerController],
})
export class SellerModule {}

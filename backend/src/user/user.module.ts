import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // 👈 add this
import { User } from '../entity/user.entity';
import { Sell } from '../entity/sell.entity';
import { Status } from '../entity/status.entity';
import { OrderDetails } from '../entity/order_details.entity';
import { Product } from '../entity/product.entity';
import { Voucher } from '../entity/voucher.entity';
import { UserController } from './user.controller';
import { UserIdService } from './user.id_service';
import { SellService } from './user.sale_service';
import { SellController } from './user.sellController';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationModule } from './notification.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, OrderDetails, Status, Sell, Voucher]),
    AuthModule,
     MailerModule,
     NotificationModule,
  ],
  controllers: [UserController, SellController],
  providers: [UserIdService, SellService],
})
export class UserModule {}

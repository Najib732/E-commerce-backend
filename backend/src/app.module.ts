import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order_details.entity';
import { Product } from './entity/product.entity';
import { User } from './entity/user.entity';
import { Sell } from './entity/sell.entity';
import { Status } from './entity/status.entity';
import { Voucher } from './entity/voucher.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'ecommarce',
      entities: [OrderDetails, Product, User, Sell, Status, Voucher],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user:'najibmahfuj132@gmail.com',       
          pass: 'aqrufklzbbqjtmab',         
        },
      },
      defaults: {
        from: '"E-Commerce" <najibmahfuj132@gmail.com>', 
      },
      template: {
        dir: __dirname + '/templates',        
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    UserModule,
    AuthModule, 
  ],
  controllers: [AppController,NotificationController],
  providers: [AppService,NotificationService],
})
export class AppModule {}

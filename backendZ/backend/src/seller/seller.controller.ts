import {
  Controller,
  Post,
  Patch,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Session,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from '../dto/create-seller.dto';
import { LoginSellerDto } from '../dto/login-seller.dto';
import { Seller } from './seller.entity';
import { Product } from '../product/product.entity';
import { SessionGuard } from '../auth/session.guard';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // ===== Create Seller (Registration) =====
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  createSeller(@Body() sellerData: CreateSellerDto): Promise<Seller> {
    return this.sellerService.createSeller(sellerData);
  }

  // ===== Seller Login =====
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginSeller(
    @Body() loginData: LoginSellerDto,
    @Session() session: Record<string, any>,
  ): Promise<{ message: string; seller?: { id: number; name: string; phone: number } }> {
    const seller = await this.sellerService.validSellerByPhone(loginData.phone, loginData.password);
    if (!seller) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    // Save session
    session.sellerId = seller.id;

    return {
      message: 'Login Successful',
      seller: { id: seller.id, name: seller.name, phone: seller.phone },
    };
  }

  // ===== Get logged-in seller info with products =====
  @UseGuards(SessionGuard)
  @Get('me')
  getMyInfo(@Session() session: Record<string, any>): Promise<Seller> {
    return this.sellerService.getSellerById(session.sellerId);
  }

  // ===== Get Products by Seller =====
  @UseGuards(SessionGuard)
  @Get(':id/products')
  getProductsBySeller(@Param('id', ParseIntPipe) id: number): Promise<Product[]> {
    return this.sellerService.getProductsBySeller(id);
  }

  // ===== Logout =====
// seller.controller.ts
@Post('logout')
async logout(@Session() session: Record<string, any>) {
  return new Promise((resolve, reject) => {
    if (!session) return resolve({ message: 'No session found' });

    session.destroy((err) => {
      if (err) return reject(err);
      resolve({ message: 'Logged out successfully' });
    });
  });
}


  // ===== Update Phone =====
  @UseGuards(SessionGuard)
  @Patch(':id/phone')
  updatePhone(@Param('id', ParseIntPipe) id: number, @Body('phone') phone: string) {
    return this.sellerService.updatePhone(id, Number(phone));
  }

  // ===== Update Seller =====
  @UseGuards(SessionGuard)
  @Put()
  updateSeller(@Body() sellerData: Seller & { id: number }): Promise<Seller> {
    return this.sellerService.updateSeller(sellerData);
  }

  // ===== Get All Sellers =====
  @UseGuards(SessionGuard)
  @Get()
  getAllSellers(): Promise<Seller[]> {
    return this.sellerService.getAllSellers();
  }

  // ===== Delete Seller =====
  @UseGuards(SessionGuard)
  @Delete(':id')
  deleteSeller(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.sellerService.deleteSeller(id);
  }
}

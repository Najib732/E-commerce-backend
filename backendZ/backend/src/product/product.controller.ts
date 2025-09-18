import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  Session,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { SessionGuard } from '../auth/session.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  
  @Post()
  @UseGuards(SessionGuard)
  async createProduct(
    @Body() productData: Partial<Product>,
    @Session() session: Record<string, any>,
  ): Promise<Product> {
    return this.productService.createProductForSeller(
      productData,
      session.sellerId,
    );
  }


  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  
  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  // ====== Update Product ======
  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productService.updateProduct(id, productData);
  }

  // ====== Delete Product ======
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.productService.deleteProduct(id);
  }

  // ====== Get Products of Logged-in Seller ======
  @UseGuards(SessionGuard)
  @Get('my-products')
  async getMyProducts(
    @Session() session: Record<string, any>,
  ): Promise<Product[]> {
    return this.productService.getProductsBySeller(session.sellerId);
  }

  // ====== Get Products by any seller ======
  @Get('seller/:sellerId')
  async getProductsBySeller(
    @Param('sellerId', ParseIntPipe) sellerId: number,
  ): Promise<Product[]> {
    return this.productService.getProductsBySeller(sellerId);
  }

  @Get('name/:name')
async findByName(@Param('name') name: string) {
  return this.productService.findByName(name);
}


  // ====== Get Seller of a Product ======
  @Get(':id/seller')
  async getSellerByProductId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product.seller;
  }
}

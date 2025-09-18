import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Seller } from '../seller/seller.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Seller) private sellerRepo: Repository<Seller>,
  ) {}

 
  async createProductForSeller(
    data: Partial<Product>,
    sellerId: number,
  ): Promise<Product> {
    const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new Error('Seller not found');

   
    const existingProduct = await this.productRepo.findOne({
      where: { name: data.name, seller: { id: sellerId } },
      relations: ['seller'],
    });

    if (existingProduct) {
     
      existingProduct.stocked += data.stocked || 1;
      existingProduct.price = data.price ?? existingProduct.price;
      existingProduct.status = data.status ?? existingProduct.status;
      return this.productRepo.save(existingProduct);
    }

   
    const product = this.productRepo.create({
      ...data,
      seller,
      stocked: data.stocked || 1,
    });
    return this.productRepo.save(product);
  }


  getAllProducts(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['seller'] });
  }
async findByName(name: string) {
  return this.productRepo.findOne({ where: { name } });
}

 
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  }

 
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    const updated = this.productRepo.merge(existingProduct, data);
    return this.productRepo.save(updated);
  }


  async deleteProduct(id: number): Promise<{ message: string }> {
    await this.productRepo.delete(id);
    return { message: `Product ${id} deleted` };
  }

  // ====== Get Products by Seller ID ======
  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return this.productRepo.find({
      where: { seller: { id: sellerId } },
      relations: ['seller'],
    });
  }
}

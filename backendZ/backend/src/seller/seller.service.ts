import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { CreateSellerDto } from '../dto/create-seller.dto';
import { Product } from '../product/product.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller) private sellerRepo: Repository<Seller>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  // ===== Create Seller =====
  async createSeller(data: CreateSellerDto): Promise<Seller> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const seller = this.sellerRepo.create({ ...data, password: hashedPassword });
    return this.sellerRepo.save(seller);
  }

  // ===== Validate Seller for Login =====
  async validSellerByPhone(phone: string | number, password: string): Promise<Seller | null> {
    const seller = await this.sellerRepo.findOne({ where: { phone: Number(phone) } });
    if (!seller) return null;
    const match = await bcrypt.compare(password, seller.password);
    if (!match) return null;
    return seller;
  }

  // ===== Update Phone =====
  async updatePhone(id: number, phone: number): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    seller.phone = phone;
    return this.sellerRepo.save(seller);
  }

  // ===== Update Seller =====
  async updateSeller(data: CreateSellerDto & { id: number }): Promise<Seller> {
    const { id, password, ...rest } = data;
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);

    Object.assign(seller, rest);

    if (password) {
      seller.password = await bcrypt.hash(password, 10);
    }

    return this.sellerRepo.save(seller);
  }

  // ===== Get All Sellers =====
  async getAllSellers(): Promise<Seller[]> {
    return this.sellerRepo.find();
  }

  // ===== Delete Seller =====
  async deleteSeller(id: number): Promise<{ message: string }> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);

    await this.sellerRepo.delete(id);
    return { message: `Seller with id ${id} deleted` };
  }

  // ===== Get Products by Seller =====
  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException(`Seller with id ${sellerId} not found`);

    return this.productRepo.find({
      where: { seller: { id: sellerId } },
      relations: ['seller'],
    });
  }

  // ===== Get Seller by ID with products (for /me) =====
  async getSellerById(id: number): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    return seller;
  }
}

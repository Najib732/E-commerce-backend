import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { CreateOrderDto } from './create-order.dto';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { sellerId, productId, address, userPhoneNumber } = createOrderDto;

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new Error('Product not found');

    const order = this.orderRepo.create({
      sellerId,
      product,
      address,
      userPhoneNumber,
    });

    return this.orderRepo.save(order);
  }

  async findOrdersBySeller(sellerId: number) {
    return this.orderRepo.find({
      where: { sellerId },
      relations: ['product'],
    });
  }
}

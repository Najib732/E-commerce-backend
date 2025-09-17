

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany  } from 'typeorm';
import { Seller } from '../seller/seller.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'available' })
  status: string;

  @Column({ default: 0 })
  stocked: number;
  
  @ManyToOne(() => Seller, (seller) => seller.products, { onDelete: 'CASCADE' })
  seller: Seller;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
  
}

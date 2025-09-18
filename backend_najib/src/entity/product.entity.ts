import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sell } from './sell.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  product_quantity: number;

  @Column()
  product_price: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @OneToMany(() => Sell, sell => sell.product)
  sells: Sell[];
}

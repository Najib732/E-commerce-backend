import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
@Column()
  
  phone: number;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}

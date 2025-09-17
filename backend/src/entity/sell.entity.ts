import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Voucher } from './voucher.entity';
import { OrderDetails } from './order_details.entity';

@Entity('sell')
export class Sell {
  @PrimaryGeneratedColumn()
  sell_id: number;

  @ManyToOne(() => Voucher, vouchar => vouchar.sells)
  @JoinColumn({ name: 'vouchar_no' })
  vouchar: Voucher;

  @ManyToOne(() => Product, product => product.sells)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_quantity: number;

  @Column()
  product_price: number;

  @ManyToOne(() => OrderDetails, order => order.sells)
  @JoinColumn({ name: 'order_id' })
  order: OrderDetails;
}

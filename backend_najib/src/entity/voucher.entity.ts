import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sell } from './sell.entity';

@Entity('voucher')
export class Voucher {
  @PrimaryGeneratedColumn()
  vouchar_no: string;

  @Column()
  total_price: number;

  @OneToMany(() => Sell, sell => sell.vouchar)
  sells: Sell[];
}

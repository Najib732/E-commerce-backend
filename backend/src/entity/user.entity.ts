import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { OrderDetails } from './order_details.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  password: string;

  @Column()
  mobile_no: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  category: string;

  @OneToMany(() => OrderDetails, order => order.user)
  orders: OrderDetails[];
}

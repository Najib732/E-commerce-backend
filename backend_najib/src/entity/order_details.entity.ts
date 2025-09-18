import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Sell } from './sell.entity';
import { Status } from './status.entity';

@Entity('order_details')
export class OrderDetails {

  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_name: string;

  @Column()
  user_phone: string;

  @Column()
  user_email: string;

  @Column()
  order_date: string;

  @ManyToOne(() => Status, status => status.orders)
  @JoinColumn({ name: 'status' })
  status: Status;

  @OneToMany(() => Sell, sell => sell.order)
  sells: Sell[];
  
}

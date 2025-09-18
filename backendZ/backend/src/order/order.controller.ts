import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  
  @Post('create')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  
  @Get('seller/:sellerId')
  findOrdersBySeller(@Param('sellerId') sellerId: number) {
    return this.orderService.findOrdersBySeller(sellerId);
  }
}

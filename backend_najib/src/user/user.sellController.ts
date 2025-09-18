import { Body, Controller, Post, Get, Param, Put, UseGuards, UsePipes, ValidationPipe, Req, ParseIntPipe, Delete, Session, Patch } from "@nestjs/common";
import { SellService } from "./user.sale_service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { salesDTO } from "src/pipes/salesDTO";
import type { RequestWithSession } from "./session.interface";
import { UpdateOrderDto } from "src/pipes/UpdateOrderDto";


@Controller("sell")
export class SellController {
  constructor(private readonly sellService: SellService) { }


  @UsePipes(ValidationPipe)
  @Post()
  async createSell(@Body() salesDTO, @Req() req: RequestWithSession): Promise<{ message: string; voucher_no: string; total_price: number; }> {
    const id = req.session.user.user_id;
    return this.sellService.createSell(id, salesDTO.items);
  }

  @UseGuards(JwtAuthGuard)
  @Get("voucher/:voucharNo")
  async getOrderByVoucher(@Param("voucharNo") voucharNo: string) {
    return this.sellService.getOrderByVoucher(voucharNo);
  }


  @UseGuards(JwtAuthGuard)
  @Get("/status/:orderId")
  async orderStatus(
    @Param("orderId", ParseIntPipe) orderId: number,
    @Req() req: RequestWithSession
  ) {
    const id = req.session.user.user_id;
    console.log(orderId, id);
    return this.sellService.orderStatus(id, orderId);

  }

  @Get("/allOrderStatus")
  async allOrdereStatus(@Req() req: RequestWithSession) {
    return this.sellService.allOrderDetails();
  }




  @Patch("/orderStatusChange/:orderId")
  async updateOrderStatus(
    @Param("orderId", ParseIntPipe) orderId: number,
    @Body("statusId", ParseIntPipe) statusId: number
  ) {
    console.log(orderId,statusId);
    return this.sellService.updateOrderStatus(orderId, statusId);
  }



  //@UseGuards(JwtAuthGuard)
  @Delete("voucher/:voucharNo")
  async deleteOrder(@Param("voucharNo") voucharNo: string) {
    return this.sellService.deleteOrderByVoucher(voucharNo);
  }

  /*
   @UseGuards(JwtAuthGuard)
   @UsePipes(ValidationPipe)
   @Put("update")
   async updateOrder(
     @Body() body: UpdateOrderDto,
     @Req() req: RequestWithSession
   ) {
     const userId = req.session.user.user_id;
     return this.sellService.updateOrder(userId, body.orderId, body.items);
   }
 
 */

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProduct() {
    return this.sellService.getAllProduct();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get("id/:id")
  async getProductById(@Param("id", ParseIntPipe) id: number) {
    return this.sellService.getProductById(id);
  }


  @Post('details')
  async productDetails(@Body() details: any, @Session() session: Record<string, any>) {

    session.cart = session.cart || {};
    const productId = details.product_id;
    if (session.cart[productId]) {
      session.cart[productId].quantity += details.quantity || 1;
    } else {
      session.cart[productId] = {
        name: details.name,
        price: details.price,
        quantity: details.quantity || 1,
      };
    }

    console.log('Cart:', session.cart);

    return {
      message: 'Product added/updated in cart successfully',
      cart: session.cart,
    };
  }

 
  @Get("/cart")
  async cartGet(@Session() session: any) {
    console.log("Session cart:", session["cart"]);
    return session["cart"] || {};
  }

}





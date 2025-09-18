import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { OrderDetails } from "src/entity/order_details.entity";
import { SellService } from "./user.sale_service";
import { Voucher } from "src/entity/voucher.entity";
import { Sell } from "src/entity/sell.entity";

@Injectable()
export class UserIdService {
    private verificationCodes: Map<number, string> = new Map();

    constructor(
     
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(OrderDetails) private orderRepo: Repository<OrderDetails>,
        @InjectRepository(Sell) private sellRepo: Repository<Sell>,
        @InjectRepository(Voucher) private voucherRepo: Repository<Voucher>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) { }

    // ✅ Create user with hashed password
    async createUserId(userData: Partial<User>): Promise<number> {
        if (!userData.password) {
            throw new Error("Password is required to create a user");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = this.userRepository.create({ ...userData, password: hashedPassword });
        const savedUser = await this.userRepository.save(newUser);

        // Send account creation email (without template)
        try {
            await this.mailerService.sendMail({
                to: savedUser.email,
                subject: 'Account Created Successfully',
                text: `Hello ${savedUser.user_name}, your account has been created successfully!`,
                html: `<p>Hello <b>${savedUser.user_name}</b>, your account has been created successfully!</p>`
            });
        } catch (err) {
            console.error('Failed to send account creation email:', err);
        }
      
        return savedUser.user_id;
    }


    async getUserById(userId: number): Promise<User> {
        const value = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!value) throw new Error(`User with ID ${userId} not found`);
        return value;
    }

    async updateUser(userId: number, userData: Partial<User>): Promise<User> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        await this.userRepository.update(userId, userData);
        return this.getUserById(userId);
    }

    async deleteUser(userId: number): Promise<void> {
        const orders = await this.orderRepo.find({
            where: { user: { user_id: userId } },
            relations: ['sells', 'sells.vouchar']
        });
        for (const order of orders) {
            const sellIds = order.sells.map(s => s.sell_id);
            if (sellIds.length) {
                await this.sellRepo.delete(sellIds);
            }
        }
        const voucherNos = [...new Set(orders.map(o => o.sells.map(s => s.vouchar.vouchar_no)).flat())];
        if (voucherNos.length) {
            await this.voucherRepo.delete(voucherNos);
        }
        const orderIds = orders.map(o => o.order_id);
        if (orderIds.length) {
            await this.orderRepo.delete(orderIds);
        }
        await this.userRepository.delete(userId);
    }

    async login(userId: number, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user) throw new Error(`User with ID ${userId} not found`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error(`Password for user ${userId} is incorrect`);

        const payload = { sub: user.user_id, email: user.email };
        const token = this.jwtService.sign(payload);

        return { user, token };
    }


}

import Pusher from 'pusher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
    private pusher: Pusher;

    constructor() {
        this.pusher = new Pusher({
            appId: "2048957",    
            key: "8afefd0184a77fa87da8",
            secret: "3071a924cd3241c57cc7",
            cluster: "mt1",
            useTLS: true,
        });
    }

    sendNotification(message: string) {
        this.pusher.trigger('my-channel', 'my-event', { message });
    }
}

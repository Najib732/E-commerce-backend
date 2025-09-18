// notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification.service';


@Module({
  providers: [NotificationService],
  exports: [NotificationService], // export korte hobe jate onno module e use kora jai
})
export class NotificationModule {}

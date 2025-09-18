import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello!';
  }

 
      getPhoto(): string {
      return 'All photos';
    }
    getPhotoById(photoid:number):string{
      return 'photo id is'+photoid;
    }
}

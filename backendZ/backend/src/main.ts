import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: 'http://localhost:8000', 
    credentials: true,
  });


  app.use(
    session({
      secret: 'mySecretKey',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, 
    }),
  );

  await app.listen(process.env.PORT ?? 3002);
  console.log(`Backend running on http://localhost:${process.env.PORT ?? 3002}`);
}
bootstrap();

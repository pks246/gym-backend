import { NestFactory } from '@nestjs/core';
import { configureApp } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  await app.listen(process.env.PORT ?? 3000);
  //comment
}
void bootstrap();

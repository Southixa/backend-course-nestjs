import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService],
})
export class AppModule {}

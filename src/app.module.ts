import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';
import { UsersService } from './users/users.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { HelpersService } from './helpers/helpers.service';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    UsersModule,
    HelpersModule],
  providers: [HelpersService],
  // controllers: [AppController, UsersController, ProductsController],
  // providers: [AppService, UsersService],
})
export class AppModule {}

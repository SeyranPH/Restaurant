import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MailingService } from './mailing/mailing.service';
import { MailingModule } from './mailing/mailing.module';
import configuration from './config/configuration';

@Module({
  imports: [
    UserModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/restaurant'),
    RestaurantModule,
    MailingModule
  ],
  controllers: [AppController],
  providers: [AppService, MailingService],
})
export class AppModule {}

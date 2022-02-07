import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { MailingModule } from 'src/mailing/mailing.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MailingModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

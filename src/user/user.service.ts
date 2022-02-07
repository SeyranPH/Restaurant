import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { bcrypt } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { User, UserInterface } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        //@InjectModel(User.name) priUser: Model<UserSchema>,
        private readonly configService: ConfigService, 
        private readonly mailingService: MailingService

    ){}

  private baseUrl = this.configService.get<string>('BASE_URL');
  private jwtSecret = this.configService.get<string>('JWT_SECRET')

  async signup(createUserDto: CreateUserDto): Promise<UserInterface> {
    const { password, email } = createUserDto;
    
    if (!validateEmail(email)) {
      throw new ForbiddenException('Invalid email')
    }

    if (!validatePassword(password)) {
      throw new ForbiddenException('Password should contain one number, one letter and one upper letter')
    }
    const passwordHash = await bcrypt.hash(password, 5);
    const userData = {
      ...createUserDto,
      password: passwordHash,
      emailConfirmed: false
    }

    const emailConfirmationToken = jwt.sign({email}, this.jwtSecret);
    const result = this.mailingService.sendEmailConfirmationMail({
      to: email,
      templateData: {confirmationUrl: `${this.baseUrl}/emailConfirmation/${emailConfirmationToken}`}
    })
    if (result){
      const createdUser = new User(userData);
      return createdUser.save();
    } else {
      throw new InternalServerErrorException('Unable to send email, try again');
    }
  }

  async emailConfirmation(userId, token) {
    const user = await User.findById(userId);
    const decoded = jwt.verify(token, this.jwtSecret);
    if (decoded.tokenType !== 'confirmation') {
      throw new ForbiddenException('Wrong token')
    }
    if (decoded.email !== user.email) {
      throw new NotAcceptableException('This token doesn\'t belong to specified user');
    }
    await User.findByIdAndUpdate(userId, {emailConfirmed: true, emailConfirmationToken: null});
    return;
  }

  async findById(userId): Promise<UserInterface> {
    return await User.findOne({id: userId});
  }

  async findAll(): Promise<UserInterface[]> {
    return User.find().exec();
  }

  async update(userId, fieldsToUpdate): Promise<UserInterface> {
    return await User.findOneAndUpdate({id: userId}, fieldsToUpdate);
  }

  async delete(userId): Promise<void> {
    await User.findOneAndDelete({id: userId});
    return;
  }
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordPattern.test(password);
}
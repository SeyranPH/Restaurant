import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setApiKey, send, MailDataRequired } from '@sendgrid/mail';
@Injectable()
export class MailingService {
    constructor(private readonly configService: ConfigService) {
        setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
    }

    private senderEmail = this.configService.get<string>('SENDGRID_SENDER_EMAIL')
    private senderName = this.configService.get<string>('SENDGRID_SENDER_NAME')

    async sendMail({to, senderEmail, senderName, type, templateData} : mailInterface): Promise<void> {
        const templateId = mailTamplateEnum[type];
        if (!templateId) {
            throw new InternalServerErrorException('Invalid mail type');
        }

        const msg : MailDataRequired = {
            to,
            from: {
              name: senderName,
              email: senderEmail,
            },
            templateId,
            dynamicTemplateData: templateData,
        };
        await send(msg);
        return;
    }

    async sendEmailConfirmationMail({to, templateData}){
        try{
            await this.sendMail({
                to,
                senderEmail: this.senderEmail,
                senderName: this.senderName,
                type: mailTamplateEnum.confirmation,
                templateData
            })
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async sendPasswordResetMail({to, templateData}){
        try{
            await this.sendMail({
                to,
                senderEmail: this.senderEmail,
                senderName: this.senderName,
                type: mailTamplateEnum.confirmation,
                templateData
            })
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}

interface mailInterface {
    to: string;
    senderEmail: string; 
    senderName: string; 
    type: mailTamplateEnum, 
    templateData: any;
}

enum mailTamplateEnum {
    confirmation = 'd-4ca176e994874d0897cbd4eccc57d645',
    passwordReset = 'd-3a9f0852151f492e92bdded0c31eaa0a'
}

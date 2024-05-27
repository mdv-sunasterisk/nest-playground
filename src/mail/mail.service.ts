import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: Transporter;
    private configService: ConfigService
    
    constructor(configService: ConfigService) {
        this.configService = configService;
        this.initializeTransporter();
    }

    initializeTransporter() {
        const host = this.configService.get('mailHost');
        const port = this.configService.get('mailPort');
        const secure = this.configService.get('mailSecure');
        const username = this.configService.get('mailUsername');
        const password = this.configService.get('mailPassword');

        this.transporter = createTransport({ host, port, secure, auth: { user: username, pass: password } })
    }

    async sendMail(to: string, subject: string, text: string, html: string) {

        await this.transporter.sendMail({ 
            from: this.configService.get('mailFrom'), 
            to, subject, text, html 
        });
    }
}

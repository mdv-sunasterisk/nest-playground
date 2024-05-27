import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueProgress, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { MailService } from "src/mail/mail.service";

@Processor('authEmail')
export class AuthEmailConsumer {
    private readonly logger = new Logger(AuthEmailConsumer.name);
    private mailService: MailService;
    private configService: ConfigService;

    constructor(mailService: MailService, configService: ConfigService) {
        this.mailService = mailService;
        this.configService = configService;
    }

    @Process('sendEmail')
    async sendEmail(job: Job<{ email: string, token: string }>) {
        job.progress(10);
        const { email, token } = job.data;
        const baseUrl          = this.configService.get("baseUrl");
        const link             = `${baseUrl}/auth/verify-email?token=${token}`;

        await this.mailService.sendMail(
            email,
            'Email Verification',
            "Thank you for registering with us. To complete your registration, please verify your email address by clicking the link below:",
            `<a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Verify Your Email</a>`
        )

        job.progress(100);
    }

    @OnQueueActive()
    onActive(job: Job<{ email: string, token: string }>) {
        this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
    }

    @OnQueueProgress()
    onProgress(job: Job, progress: number) {
        this.logger.log(`Progress job ${job.id} of type ${job.name} with data ${job.data}...`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        this.logger.log(`Completed job ${job.id} of type ${job.name} with data ${job.data}...`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        this.logger.log(`Failed job ${job.id} of type ${job.name} with data ${job.data}...`);
        this.logger.log(error);
    }
}
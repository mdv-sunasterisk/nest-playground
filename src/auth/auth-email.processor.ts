import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueProgress, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('authEmail')
export class AuthEmailConsumer {
    private readonly logger = new Logger(AuthEmailConsumer.name);

    constructor() {}

    @Process('sendEmail')
    async sendEmail(job: Job<{ email: string, token: string }>) {
        job.progress(10);
        const { email, token } = job.data;

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
    }
}
import { SendMailOptions } from 'nodemailer';
import { IEmailStrategy } from './interfaces';
import { httpLogger } from '../../logger';

export class EmailService {
  private static instance: EmailService;
  private strategies: IEmailStrategy[];

  private constructor() {
    this.strategies = [];
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public addStrategy(strategy: IEmailStrategy): void {
    this.strategies.push(strategy);
  }

  public async sendMail(options: SendMailOptions): Promise<void> {
    for (const strategy of this.strategies) {
      try {
        await strategy.sendMail(options);
        httpLogger.info('Email sent successfully');
        return;
      } catch (error) {
        httpLogger.error('Failed with current strategy, trying next...', error);
      }
    }
    throw new Error('All strategies failed to send email');
  }
}

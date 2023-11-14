import { SendMailOptions } from 'nodemailer';

export interface IEmailStrategy {
  // eslint-disable-next-line no-unused-vars
  sendMail(options: SendMailOptions): Promise<void>;
}

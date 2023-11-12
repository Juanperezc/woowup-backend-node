import { SendMailOptions } from "nodemailer";

export interface IEmailStrategy {
  sendMail(options: SendMailOptions): Promise<void>;
}

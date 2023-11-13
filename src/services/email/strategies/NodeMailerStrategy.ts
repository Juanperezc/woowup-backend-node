import { SendMailOptions, Transporter } from "nodemailer";
import { IEmailStrategy } from "../interfaces";

export class NodemailerStrategy implements IEmailStrategy {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  public async sendMail(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail(options);
  }
}
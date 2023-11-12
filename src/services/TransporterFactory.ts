import nodemailer, { Transporter } from "nodemailer";

export class TransporterFactory {
  public static createTransporter(
    service: string,
    credentials: { user: string; pass: string }
  ): Transporter {
    switch (service) {
      case "SendGrid":
        return nodemailer.createTransport({
          service: "SendGrid",
          host: "smtp.sendgrid.net",
          auth: credentials,
        });
      case "Mailgun":
        return nodemailer.createTransport({
        service: "Mailgun",
        host:  'smtp.mailgun.org',
        port: 587,
        auth: credentials,
        });
      default:
        throw new Error("Unknown email service provider");
    }
  }
}

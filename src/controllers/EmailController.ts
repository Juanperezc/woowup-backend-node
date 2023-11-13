import { Request, Response } from 'express';

import { httpLogger } from '../logger';
import Mail from 'nodemailer/lib/mailer';
import { EmailService } from '../services/email/EmailService';


export class EmailController {
    private emailService: EmailService;

    constructor() {
        this.emailService = EmailService.getInstance();
        this.sendEmail = this.sendEmail.bind(this);
    }
    public async sendEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { title, text, emailAddresses } = req.body;
         
            const mailOptions: Mail.Options = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: emailAddresses.join(', '), // Send to all email addresses
                subject: title,
                html: text,
            };
            await this.emailService.sendMail(mailOptions);
            return res.status(200).json({ message: 'Emails sent successfully' });
        } catch (error) {
            httpLogger.error('Failed to send emails:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

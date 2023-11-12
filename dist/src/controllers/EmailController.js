"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const EmailService_1 = require("../services/EmailService");
const logger_1 = require("../logger");
class EmailController {
    constructor() {
        this.emailService = EmailService_1.EmailService.getInstance();
        this.sendEmail = this.sendEmail.bind(this);
    }
    sendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, text, emailAddresses } = req.body;
                const mailOptions = {
                    from: process.env.MAIL_FROM_ADDRESS,
                    to: emailAddresses.join(', '),
                    subject: title,
                    html: text,
                };
                yield this.emailService.sendMail(mailOptions);
                return res.status(200).json({ message: 'Emails sent successfully' });
            }
            catch (error) {
                logger_1.httpLogger.error('Failed to send emails:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.EmailController = EmailController;

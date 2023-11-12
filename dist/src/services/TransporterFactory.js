"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransporterFactory = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class TransporterFactory {
    static createTransporter(service, credentials) {
        switch (service) {
            case "SendGrid":
                return nodemailer_1.default.createTransport({
                    service: "SendGrid",
                    host: "smtp.sendgrid.net",
                    auth: credentials,
                });
            case "Mailgun":
                return nodemailer_1.default.createTransport({
                    service: "Mailgun",
                    host: 'smtp.mailgun.org',
                    port: 587,
                    auth: credentials,
                });
            default:
                throw new Error("Unknown email service provider");
        }
    }
}
exports.TransporterFactory = TransporterFactory;

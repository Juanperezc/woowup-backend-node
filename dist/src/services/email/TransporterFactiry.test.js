"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const TransporterFactory_1 = require("./TransporterFactory");
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(),
}));
describe('TransporterFactory', () => {
    const mockCreateTransport = nodemailer_1.default.createTransport;
    it('should create a SendGrid transporter', () => {
        const credentials = { user: 'user@example.com', pass: 'password' };
        TransporterFactory_1.TransporterFactory.createTransporter('SendGrid', credentials);
        expect(mockCreateTransport).toHaveBeenCalledWith({
            service: 'SendGrid',
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: credentials,
        });
    });
    it('should create a Mailgun transporter', () => {
        const credentials = { user: 'user@example.com', pass: 'password' };
        TransporterFactory_1.TransporterFactory.createTransporter('Mailgun', credentials);
        expect(mockCreateTransport).toHaveBeenCalledWith({
            service: 'Mailgun',
            host: 'smtp.mailgun.org',
            port: 587,
            auth: credentials,
        });
    });
    it('should throw an error for an unknown service provider', () => {
        const credentials = { user: 'user@example.com', pass: 'password' };
        expect(() => {
            TransporterFactory_1.TransporterFactory.createTransporter('UnknownService', credentials);
        }).toThrow('Unknown email service provider');
    });
});

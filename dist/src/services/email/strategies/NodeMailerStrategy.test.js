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
const NodeMailerStrategy_1 = require("./NodeMailerStrategy");
describe('NodemailerStrategy', () => {
    let nodemailerStrategy;
    let mockTransporter;
    beforeEach(() => {
        // Create a mock Transporter
        mockTransporter = {
            sendMail: jest.fn(),
        };
        // Initialize NodemailerStrategy with the mock Transporter
        nodemailerStrategy = new NodeMailerStrategy_1.NodemailerStrategy(mockTransporter);
    });
    it('should send an email successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = {
            from: 'test@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email',
        };
        // Mock implementation to simulate successful email sending
        mockTransporter.sendMail.mockResolvedValue({});
        yield nodemailerStrategy.sendMail(mailOptions);
        expect(mockTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    }));
    it('should throw an error when email sending fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = {
            from: 'test@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email',
        };
        // Mock implementation to simulate a failure in sending email
        const error = new Error('Failed to send email');
        mockTransporter.sendMail.mockRejectedValue(error);
        yield expect(nodemailerStrategy.sendMail(mailOptions)).rejects.toThrow(error);
        expect(mockTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    }));
});

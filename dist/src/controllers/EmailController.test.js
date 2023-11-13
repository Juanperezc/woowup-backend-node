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
const EmailController_1 = require("./EmailController");
const EmailService_1 = require("../services/email/EmailService");
// Mock the entire EmailService module
jest.mock('../services/email/EmailService');
describe('EmailController', () => {
    let emailController;
    let mockSendMail;
    beforeEach(() => {
        // Reset the mock before each test
        mockSendMail = jest.fn();
        EmailService_1.EmailService.getInstance = jest.fn(() => ({
            sendMail: mockSendMail,
        }));
        emailController = new EmailController_1.EmailController();
    });
    it('should send an email successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request and response objects
        const req = {
            body: {
                title: 'Test Email',
                text: '<p>This is a test email</p>',
                emailAddresses: ['test@example.com']
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock implementation of sendMail
        mockSendMail.mockResolvedValue(undefined);
        // Call the method
        yield emailController.sendEmail(req, res);
        // Assertions
        expect(mockSendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Emails sent successfully' });
    }));
    it('should handle errors when sending an email', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: {
                title: 'Test Email',
                text: '<p>This is a test email</p>',
                emailAddresses: ['test@example.com']
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock implementation to throw an error
        mockSendMail.mockRejectedValue(new Error('Failed to send email'));
        // Call the method
        yield emailController.sendEmail(req, res);
        // Assertions for error handling
        expect(mockSendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    }));
    // Add more test cases as needed
});

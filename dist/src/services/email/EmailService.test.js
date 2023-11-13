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
const EmailService_1 = require("./EmailService");
jest.mock('../../logger', () => ({
    httpLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));
describe('EmailService', () => {
    let emailService;
    let mockStrategy1;
    let mockStrategy2;
    beforeEach(() => {
        emailService = EmailService_1.EmailService.getInstance();
        emailService['strategies'] = []; // Reset strategies
        // Create mock strategies
        mockStrategy1 = { sendMail: jest.fn() };
        mockStrategy2 = { sendMail: jest.fn() };
        // Add mock strategies to the service
        emailService.addStrategy(mockStrategy1);
        emailService.addStrategy(mockStrategy2);
    });
    it('should send email using the first strategy', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = { /* ... */};
        mockStrategy1.sendMail.mockResolvedValue(undefined);
        yield emailService.sendMail(mailOptions);
        expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
        expect(mockStrategy2.sendMail).not.toHaveBeenCalled();
    }));
    it('should fallback to the second strategy if the first fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = { /* ... */};
        mockStrategy1.sendMail.mockRejectedValue(new Error('Failed'));
        mockStrategy2.sendMail.mockResolvedValue(undefined);
        yield emailService.sendMail(mailOptions);
        expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
        expect(mockStrategy2.sendMail).toHaveBeenCalledWith(mailOptions);
    }));
    it('should throw an error if all strategies fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = { /* ... */};
        mockStrategy1.sendMail.mockRejectedValue(new Error('Failed'));
        mockStrategy2.sendMail.mockRejectedValue(new Error('Failed'));
        yield expect(emailService.sendMail(mailOptions)).rejects.toThrow('All strategies failed to send email');
        expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
        expect(mockStrategy2.sendMail).toHaveBeenCalledWith(mailOptions);
    }));
});

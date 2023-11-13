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
exports.EmailService = void 0;
const logger_1 = require("../../logger");
class EmailService {
    constructor() {
        this.strategies = [];
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    addStrategy(strategy) {
        this.strategies.push(strategy);
    }
    sendMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const strategy of this.strategies) {
                try {
                    yield strategy.sendMail(options);
                    logger_1.httpLogger.info("Email sent successfully");
                    return;
                }
                catch (error) {
                    logger_1.httpLogger.error("Failed with current strategy, trying next...", error);
                }
            }
            throw new Error("All strategies failed to send email");
        });
    }
}
exports.EmailService = EmailService;

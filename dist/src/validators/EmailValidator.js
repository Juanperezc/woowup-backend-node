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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidator = void 0;
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
class EmailValidator {
    static validateSendEmail() {
        return [
            (0, express_validator_1.body)("title")
                .isString()
                .notEmpty()
                .withMessage("Title is required and must be a string"),
            (0, express_validator_1.body)("text")
                .isString()
                .notEmpty()
                .withMessage("Text is required and must be a string"),
            (0, express_validator_1.body)("emailAddresses")
                .isArray({ min: 1, max: 5 })
                .withMessage("EmailAddresses must be an array with 1 to 5 emails"),
            (0, express_validator_1.body)("emailAddresses.*")
                .isEmail()
                .withMessage("Each email address must be a valid email"),
            (0, express_validator_1.body)("g-recaptcha-response")
                .notEmpty()
                .withMessage("reCAPTCHA response is required"),
        ];
    }
    static validate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const recaptchaResponse = req.body["g-recaptcha-response"];
            const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (!recaptchaResponse || !recaptchaSecretKey) {
                return res.status(400).json({ error: "reCAPTCHA validation failed" });
            }
            try {
                const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaResponse}`;
                const response = yield axios_1.default.post(recaptchaVerifyUrl);
                if (!response.data.success) {
                    return res
                        .status(401)
                        .json({ error: "Invalid reCAPTCHA. Please try again." });
                }
                next();
            }
            catch (error) {
                console.error("reCAPTCHA verification error:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.EmailValidator = EmailValidator;

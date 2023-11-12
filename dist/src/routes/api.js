"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailController_1 = require("../controllers/EmailController");
const EmailValidator_1 = require("../validators/EmailValidator");
const router = express_1.default.Router();
const emailController = new EmailController_1.EmailController();
/**
 * @openapi
 * /api/emails/send:
 *   post:
 *     tags:
 *       - Email
 *     summary: Send an email
 *     description: Send an email to multiple recipients. Includes reCAPTCHA v3 validation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *               emailAddresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *               g-recaptcha-response:
 *                 type: string
 *                 description: The response string from reCAPTCHA v3 verification on the client side.
 *             required:
 *               - title
 *               - text
 *               - emailAddresses
 *               - g-recaptcha-response
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Bad request due to invalid input or failed reCAPTCHA verification
 */
router.post('/send-mail-failover', EmailValidator_1.EmailValidator.validateSendEmail(), EmailValidator_1.EmailValidator.validate, emailController.sendEmail);
exports.default = router;

import express from "express";
import { EmailController } from "../controllers/EmailController";
import { EmailValidator } from "../validators/EmailValidator";

const router = express.Router();

const emailController = new EmailController();

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
router.post('/send-mail-failover', EmailValidator.validateSendEmail(), EmailValidator.validate, emailController.sendEmail);


export default router;

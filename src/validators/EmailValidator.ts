import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { httpLogger } from "../logger";
const axios = require("axios");

export class EmailValidator {
  static validateSendEmail() {
    return [
      body("title")
        .isString()
        .notEmpty()
        .withMessage("Title is required and must be a string"),
      body("text")
        .isString()
        .notEmpty()
        .withMessage("Text is required and must be a string"),
      body("emailAddresses")
        .isArray({ min: 1, max: 5 })
        .withMessage("EmailAddresses must be an array with 1 to 5 emails"),
      body("emailAddresses.*")
        .isEmail()
        .withMessage("Each email address must be a valid email"),
      body("g-recaptcha-response")
        .notEmpty()
        .withMessage("reCAPTCHA response is required"),
    ];
  }

  static async validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
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
      const response = await axios.post(recaptchaVerifyUrl);
      if (!response.data.success) {
        return res
          .status(401)
          .json({ error: "Invalid reCAPTCHA. Please try again." });
      }

      next();
    } catch (error) {
      httpLogger.error("reCAPTCHA verification error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

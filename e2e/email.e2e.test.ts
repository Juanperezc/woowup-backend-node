import express from "express";
import request from "supertest";
import bodyParser from "body-parser";
import apiRouter from "../src/routes/api";
import axios from "axios";

// Mock EmailValidator to bypass actual validation
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValue({ data: { success: true } });

jest.mock("../src/services/email/EmailService", () => {
  return {
    EmailService: {
      getInstance: jest.fn().mockImplementation(() => {
        return {
          sendMail: jest.fn().mockResolvedValue({
          }),
        };
      }),
    },
  };
});
// Set up the Express app for testing
const app = express();
app.use(bodyParser.json());
app.use("/api/v1", apiRouter);

describe("Email API", () => {
  // Test for successful email sending
  it("should send an email successfully", async () => {
    // Mock axios globally
    process.env.RECAPTCHA_SITE_KEY = "test";
    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "Test Email",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": "test",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Emails sent successfully" });
  }, 5000);

  // Test for invalid input (400 Bad Request)
  it("should return 400 for invalid input", async () => {
    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "", // Invalid title
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": "test",
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 for g-recaptcha-response null", async () => {
    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "test",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": null,
      });

    expect(response.statusCode).toBe(400);
  });
  it("should return 400 for RECAPTCHA_SITE_KEY undefined", async () => {
    delete process.env.RECAPTCHA_SITE_KEY;

    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "test",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": "test",
      });

    expect(response.statusCode).toBe(400);
  });
  it("should return 401 for invalid reCAPTCHA", async () => {
    // Mock axios to simulate invalid reCAPTCHA response
    process.env.RECAPTCHA_SITE_KEY = "test";
    mockedAxios.post.mockResolvedValueOnce({ data: { success: false } });

    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "Test Email",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": "invalid-response",
      });

    expect(response.statusCode).toBe(401);
  });

  // Test for missing reCAPTCHA response or secret key
  it("should return 400 for missing reCAPTCHA response or secret key", async () => {
    // Clear reCAPTCHA secret key
    delete process.env.RECAPTCHA_SITE_KEY;

    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "Test Email",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        // "g-recaptcha-response" is missing
      });

    expect(response.statusCode).toBe(400);
  });

  // Test for reCAPTCHA request error
  it("should return 500 for reCAPTCHA request error", async () => {
    // Mock axios to simulate a request error

    mockedAxios.post.mockRejectedValueOnce(new Error("Request failed"));
    process.env.RECAPTCHA_SITE_KEY = "test";

    const response = await request(app)
      .post("/api/v1/send-mail-failover")
      .send({
        title: "Test Email",
        text: "This is a test email",
        emailAddresses: ["test@example.com"],
        "g-recaptcha-response": "test",
      });

    expect(response.statusCode).toBe(500);
  });
});

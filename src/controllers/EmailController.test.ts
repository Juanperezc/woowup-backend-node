import { Request, Response } from 'express';

import { EmailController } from './EmailController';
import { EmailService } from '../services/email/EmailService';

// Mock the entire EmailService module
jest.mock('../services/email/EmailService');

describe('EmailController', () => {
  let emailController: EmailController;
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    // Reset the mock before each test
    mockSendMail = jest.fn();
    (EmailService.getInstance as jest.Mock) = jest.fn(() => ({
      sendMail: mockSendMail,
    }));

    emailController = new EmailController();
  });

  it('should send an email successfully', async () => {
    // Mock request and response objects
    const req: Partial<Request> = {
      body: {
        title: 'Test Email',
        text: '<p>This is a test email</p>',
        emailAddresses: ['test@example.com']
      }
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock implementation of sendMail
    mockSendMail.mockResolvedValue(undefined);

    // Call the method
    await emailController.sendEmail(req as Request, res as Response);

    // Assertions
    expect(mockSendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Emails sent successfully' });
  });

  it('should handle errors when sending an email', async () => {
    const req: Partial<Request> = {
      body: {
        title: 'Test Email',
        text: '<p>This is a test email</p>',
        emailAddresses: ['test@example.com']
      }
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock implementation to throw an error
    mockSendMail.mockRejectedValue(new Error('Failed to send email'));

    // Call the method
    await emailController.sendEmail(req as Request, res as Response);

    // Assertions for error handling
    expect(mockSendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // Add more test cases as needed
});

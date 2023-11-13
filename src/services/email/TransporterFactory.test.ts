import nodemailer from 'nodemailer';
import { TransporterFactory } from './TransporterFactory';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('TransporterFactory', () => {
  const mockCreateTransport = nodemailer.createTransport as jest.Mock;

  it('should create a SendGrid transporter', () => {
    const credentials = { user: 'user@example.com', pass: 'password' };
    TransporterFactory.createTransporter('SendGrid', credentials);

    expect(mockCreateTransport).toHaveBeenCalledWith({
      service: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: credentials,
    });
  });

  it('should create a Mailgun transporter', () => {
    const credentials = { user: 'user@example.com', pass: 'password' };
    TransporterFactory.createTransporter('Mailgun', credentials);

    expect(mockCreateTransport).toHaveBeenCalledWith({
      service: 'Mailgun',
      host: 'smtp.mailgun.org',
      port: 587,
      auth: credentials,
    });
  });

  it('should throw an error for an unknown service provider', () => {
    const credentials = { user: 'user@example.com', pass: 'password' };
    expect(() => {
      TransporterFactory.createTransporter('UnknownService', credentials);
    }).toThrow('Unknown email service provider');
  });

});

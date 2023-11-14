import { SendMailOptions, Transporter } from 'nodemailer';
import { NodemailerStrategy } from './NodeMailerStrategy';

describe('NodemailerStrategy', () => {
  let nodemailerStrategy: NodemailerStrategy;
  let mockTransporter: jest.Mocked<Transporter>;

  beforeEach(() => {
    // Create a mock Transporter
    mockTransporter = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<Transporter>;

    // Initialize NodemailerStrategy with the mock Transporter
    nodemailerStrategy = new NodemailerStrategy(mockTransporter);
  });

  it('should send an email successfully', async () => {
    const mailOptions: SendMailOptions = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };

    // Mock implementation to simulate successful email sending
    mockTransporter.sendMail.mockResolvedValue({} as any);

    await nodemailerStrategy.sendMail(mailOptions);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
  });

  it('should throw an error when email sending fails', async () => {
    const mailOptions: SendMailOptions = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };

    // Mock implementation to simulate a failure in sending email
    const error = new Error('Failed to send email');
    mockTransporter.sendMail.mockRejectedValue(error);

    await expect(nodemailerStrategy.sendMail(mailOptions)).rejects.toThrow(error);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
  });
});

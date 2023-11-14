import { EmailService } from './EmailService';
import { IEmailStrategy } from './interfaces';
import { SendMailOptions } from 'nodemailer';

jest.mock('../../logger', () => ({
  httpLogger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let mockStrategy1: jest.Mocked<IEmailStrategy>;
  let mockStrategy2: jest.Mocked<IEmailStrategy>;

  beforeEach(() => {
    emailService = EmailService.getInstance();
    emailService['strategies'] = []; // Reset strategies

    // Create mock strategies
    mockStrategy1 = { sendMail: jest.fn() };
    mockStrategy2 = { sendMail: jest.fn() };

    // Add mock strategies to the service
    emailService.addStrategy(mockStrategy1);
    emailService.addStrategy(mockStrategy2);
  });

  it('should send email using the first strategy', async () => {
    const mailOptions: SendMailOptions = {
      /* ... */
    };
    mockStrategy1.sendMail.mockResolvedValue(undefined);

    await emailService.sendMail(mailOptions);

    expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
    expect(mockStrategy2.sendMail).not.toHaveBeenCalled();
  });

  it('should fallback to the second strategy if the first fails', async () => {
    const mailOptions: SendMailOptions = {
      /* ... */
    };
    mockStrategy1.sendMail.mockRejectedValue(new Error('Failed'));
    mockStrategy2.sendMail.mockResolvedValue(undefined);

    await emailService.sendMail(mailOptions);

    expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
    expect(mockStrategy2.sendMail).toHaveBeenCalledWith(mailOptions);
  });

  it('should throw an error if all strategies fail', async () => {
    const mailOptions: SendMailOptions = {
      /* ... */
    };
    mockStrategy1.sendMail.mockRejectedValue(new Error('Failed'));
    mockStrategy2.sendMail.mockRejectedValue(new Error('Failed'));

    await expect(emailService.sendMail(mailOptions)).rejects.toThrow('All strategies failed to send email');

    expect(mockStrategy1.sendMail).toHaveBeenCalledWith(mailOptions);
    expect(mockStrategy2.sendMail).toHaveBeenCalledWith(mailOptions);
  });
});

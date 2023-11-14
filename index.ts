import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/swagger';
import indexRouter from './src/routes/index';
import apiRouter from './src/routes/api';

import { NodemailerStrategy } from './src/services/email/strategies/NodeMailerStrategy';
import { EmailService } from './src/services/email/EmailService';
import { TransporterFactory } from './src/services/email/TransporterFactory';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://woowup-frontend-assessment.vercel.app'],
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static('public/images/favicon.ico'));

app.set('view engine', 'html');

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', indexRouter);

app.use('/api/v1', apiRouter);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500);
  res.json({ error: err.message || 'Internal Server Error' });
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Email service setup
const emailService = EmailService.getInstance();

// Mailgun configuration
const mailgunTransporter = TransporterFactory.createTransporter('Mailgun', {
  user: process.env.MAILGUN_USERNAME ?? '',
  pass: process.env.MAILGUN_PASSWORD ?? '',
});
const mailgunStrategy = new NodemailerStrategy(mailgunTransporter);
emailService.addStrategy(mailgunStrategy);

// SendGrid configuration
const sendGridTransporter = TransporterFactory.createTransporter('SendGrid', {
  user: process.env.SENDGRID_USERNAME ?? '',
  pass: process.env.SENDGRID_PASSWORD ?? '',
});
const sendGridStrategy = new NodemailerStrategy(sendGridTransporter);
emailService.addStrategy(sendGridStrategy);

export default app;

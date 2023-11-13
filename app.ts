import express, { Express, Request, Response, NextFunction } from 'express';
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
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

let corsOptions = { 
   origin : ['http://localhost:3000'], 
} 

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
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({ error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

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
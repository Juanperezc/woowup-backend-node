"use strict";
/* const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('../src/routes/api');

// Set up the Express app for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/v1', apiRoutes);

describe('Email API', () => {
  it('should send an email successfully', async () => {
    const response = await request(app)
      .post('/send-mail-failover')
      .send({
        title: 'Test Email',
        text: 'This is a test email',
        emailAddresses: ['test@example.com'],
        'g-recaptcha-response': 'test' // Mock reCAPTCHA response
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Emails sent successfully' });
  });

  
});
 */ 

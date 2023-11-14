# Woowup Backend Node

This project is a Node.js backend application, primarily focused on handling email functionalities.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Juanperezc/woowup-backend-node.git
   ```
2. Navigate to the project directory:
   ```bash
   cd woowup-backend-node
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

- Create a `.env` file in the root directory and set up the necessary environment variables. For example:
  ```
  PORT=3000
  MAILGUN_USERNAME=your_mailgun_username
  MAILGUN_PASSWORD=your_mailgun_password
  SENDGRID_USERNAME=your_sendgrid_username
  SENDGRID_PASSWORD=your_sendgrid_password
  MAIL_FROM_ADDRESS=your_email@example.com
  ```

### Running the Application

- To start the application in development mode:
  ```bash
  npm run dev
  ```
- To build the application:
  ```bash
  npm run build
  ```
- To start the built application:
  ```bash
  npm start
  ```

### Testing

- To run tests:
  ```bash
  npm test
  ```
- To check test coverage:
  ```bash
  npm run test:coverage
  ```

## Features

- Email sending functionality with failover strategies (Mailgun and SendGrid).
- REST API endpoints for email operations.
- Swagger documentation for API endpoints.

## Considerations

- Ensure that all required environment variables are set in the `.env` file.
- The application uses CORS and is configured to allow requests from `http://localhost:3000` by default. Adjust the CORS settings in `app.ts` if necessary.


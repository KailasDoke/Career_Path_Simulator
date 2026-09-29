# Development Guide

## Setup Instructions

### Backend
1. Ensure Java 21+ is installed.
2. Ensure PostgreSQL is installed and running.
3. Create a `.env` file from `.env.example` and fill in your database credentials.
4. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend
1. Ensure Node.js is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Development Rules
*   Do not put business logic in controllers.
*   Use standard DTOs for API requests and responses.
*   Never rewrite working code unnecessarily.
*   No secrets in source code.

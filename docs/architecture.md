# System Architecture

## Overview
The Career Path Simulator is a modern education-to-career decision platform built with a microservices-inspired monolithic architecture.

## Components
1.  **Frontend (React/Vite)**
    *   **Responsibilities**: User interface, state management, data visualization (React Flow), pathway simulations.
    *   **Tech Stack**: React, TypeScript, Tailwind CSS, shadcn/ui.
2.  **Backend (Spring Boot)**
    *   **Responsibilities**: API Gateway, Business Logic, Data Access, Validation, Security.
    *   **Tech Stack**: Java, Spring Boot, Spring Data JPA.
3.  **Database (PostgreSQL)**
    *   **Responsibilities**: Persisting structured application data (institutions, scholarships, users, loans).
4.  **Future AI Layer (LLM API)**
    *   **Responsibilities**: Natural language understanding, pathway explanations, dynamic conversational features (Retrieval-Augmented Generation).
    *   *Note*: Structured application data remains the source of truth; LLM is used strictly for presentation and interpretation.
5.  **Future Simulation Engine**
    *   **Responsibilities**: What-if recalculations, financial modeling, scoring multiple pathways against user constraints.

## Frontend/Backend Relationship
*   The frontend communicates with the backend via RESTful APIs.
*   Data transfer is facilitated strictly through DTOs (Data Transfer Objects).
*   Authentication is handled via JWT.

## Database Relationship
*   The Spring Boot backend interacts with PostgreSQL using Spring Data JPA.
*   Database schema modifications will be managed (potentially using tools like Flyway/Liquibase in the future).

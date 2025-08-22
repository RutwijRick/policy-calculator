### Simple Policy Generator / Calculator System

A full-stack project implementing a policy benefit illustration engine with authentication, policy management, riders, and year-wise projections.
This system checks for inputs, validates inputs and calculates the policy.

## Features Implemented

- Authentication & Security

- Login & Register flow with full validation.

- Sensitive user data (Name, DOB, Mobile Number) masked and stored securely in the database.

- Environment-based secrets management using process.env.

- Policy Management

- CRUD APIs for Policies (Create, Read, Update, Delete).

## Policy attributes supported:

- Policy Type

- Sum Assured

- Premium & Frequency

- Policy Term (PT) & Premium Payment Term (PPT)

- Riders (Accident Cover, Disability, etc.)

- Benefit Illustration Engine

- Core calculation engine for policy projections.

# Features include:

- Premium allocation & bonus additions.

- Rider benefits (dynamic, configurable).

- Net cashflow, IRR, total maturity value.

- Validation checks aligned with business logic (5+ conditions).

- Age calculation based on completed birthdays.

# Frontend (React)

Dynamic form for policy details input.

Illustration Page with responsive, year-wise projection table.

Riders and benefits displayed separately with total rollups.

Clean UI using a free template, customized for usability.

# Backend (Node.js + Express)

# REST APIs for:

Policy creation & retrieval

Benefit calculation

Rider management

Clean architecture: Controllers, Services, Utils.

Modular rider logic → easily extendable for new riders.

Database Layer

MySQL database for structured storage.

Masked storage for sensitive fields.

Schema supports multiple riders per policy and extensibility.

Scalability Enhancements

Batch Calculation API → Handles bulk inputs by chunking requests (millions of rows).

Worker Queue (planned) → Async heavy calculations via Bull/Redis.

Database Indexing → Indexed userId, policyType, dob for faster lookups.

Modular Rider Engine → Each rider runs independently, supports parallel computation.

Stateless Backend → Horizontally scalable with load balancers.

## Setup

# Backend
###
cd backend
npm install
cp .env.example .env   # configure DB + secrets
npm run dev
###

# Frontend
###
cd frontend
npm install
npm start
###


# Scalability plan (bulk millions)

Ingestion & batching

Accept bulk CSV/Parquet uploads to object storage (S3/GCS). Generate a job record.

Use message queue (e.g., RabbitMQ / SQS + Worker) to process in chunks (e.g., 10k at a time).

Workers in Node.js using BullMQ (Redis) or SQS; horizontally scale workers in K8s.

Use Sequelize bulkCreate with updateOnDuplicate and transactions per chunk; turn off per-row hooks when safe.
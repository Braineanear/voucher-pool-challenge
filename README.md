# Backend Coding Challenge - Voucher Pool

## Overview

The objective of this challenge is to create a voucher pool microservice in Node.js/TypeScript, preferably using NestJS. The service exposes a REST API and manages voucher codes that customers can use to get discounts on a website. Each voucher code is unique, can be used only once, and tracks its usage.

## Entities

### Customer

- **Name**: Name of the customer.
- **Email**: Unique email of the customer.

### Special Offer

- **Name**: Name of the special offer.
- **Fixed Percentage Discount**: Discount percentage.

### Voucher Code

- **Code**: Unique randomly generated code (at least 8 characters).
- **Assigned to**: A Customer and a Special Offer.
- **Expiration Date**: Date when the voucher expires.
- **Usage Date**: Tracks the date of usage.

## Functionalities

1. **Generate Voucher Code**: Generates a voucher code for each customer for a given Special Offer and expiration date.
2. **Validate Voucher Code**: Provides an endpoint that receives a Voucher Code and Email, validates the Voucher Code, returns the Percentage Discount, and sets the date of usage if valid.
3. **Get Voucher Codes by Customer**: For a given Email, returns all valid Voucher Codes with the name of the Special Offer.

## Requirements

- Node.js: 20
- NestJS CLI
- Docker
- Yarn

## Project Structure

The application is built using Node.js with NestJS and MongoDB with Mongoose ORM. It consists of three microservices, each communicating via TCP connections:

1. **Customer Service**
   - **APIs/Methods**:
     1. Create customer.
     2. Get customer by email.
     3. Get all customers.
     4. Update customer by email.
     5. Delete customer by email.

2. **Special Offer Service**
   - **APIs/Methods**:
     1. Create special offer.
     2. Get special offer by name.
     3. Get all special offers.
     4. Update special offer by name.
     5. Delete special offer by name.

3. **Voucher Code Service**
   - **APIs/Methods**:
     1. Create voucher code.
     2. Validate voucher code.
     3. Get vouchers by customer email.

Each project includes:

- **DTOs**: Data Transfer Objects.
- **Schema**: Database schema definitions.
- **Repository**: Database operations.
- **Service**: Business logic.
- **Controller**: HTTP request handling.

### API Gateway

The API Gateway, built with NestJS, allows the client to interact with the microservices. It contains a controller for each microservice, providing endpoints that communicate with the corresponding microservice.

### Logging

We use Winston as the logging service for all microservices.

## Swagger Documentation

Swagger documentation for the API Gateway endpoints is available at: `http://localhost:8080/docs`

## Running the Application

1. Clone the repository.
2. Navigate to the project directory.
3. Ensure you have Docker installed and running.
4. Run the following command to start the services:

```sh
docker-compose up -d --build
```

Use the provided endpoints to interact with the services.

## Default Ports

- **Customer Service**: 3000
- **Voucher Code Service**: 3001
- **Special Offer Service**: 3002
- **API Gateway**: 8080

You can configure your own ports in the docker-compose.yml file.

## MongoDB Access

The Docker Compose setup includes a MongoDB service accessible with the following connection string: `mongodb://localhost:27017/`

## Unit Tests

Each microservice project includes unit tests to ensure code quality and functionality. The unit tests cover all major functionalities of the services, including creating, retrieving, updating, and deleting entities.

### Running Unit Tests

To run the unit tests for each project, follow these steps:

1. Ensure you have installed all dependencies by running `yarn install` in each project directory.
2. Navigate to the project directory for the service you want to test (e.g., `customer`, `special-offer`, or `voucher-code`).
3. Run the following command to execute the tests:

```sh
yarn run test
```

# API Gateway

This is the API Gateway for the microservices architecture. It routes requests to the appropriate services.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file:
- PORT: Port for the API Gateway (default: 3000)
- CUSTOMER_SERVICE_URL: URL of the Customer Service
- ORDER_SERVICE_URL: URL of the Order Service
- PRODUCT_SERVICE_URL: URL of the Product Service

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- Customer Service: `/api/customers/*`
- Order Service: `/api/orders/*`
- Product Service: `/api/products/*`
- Health Check: `/health`

## Example Requests

- Get all customers: `GET http://localhost:3000/api/customers`
- Get all orders: `GET http://localhost:3000/api/orders`
- Get all products: `GET http://localhost:3000/api/products` 
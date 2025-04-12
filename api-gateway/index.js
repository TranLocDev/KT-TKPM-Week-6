const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));
app.use(express.json());

// Service URLs
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003';

// Proxy configurations
const customerProxy = createProxyMiddleware({
  target: CUSTOMER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/customers': '/'
  },
  onError: (err, req, res) => {
    console.error('Customer Service Error:', err);
    res.status(500).json({ error: 'Customer Service is not available' });
  }
});

const orderProxy = createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/'
  },
  onError: (err, req, res) => {
    console.error('Order Service Error:', err);
    res.status(500).json({ error: 'Order Service is not available' });
  }
});

const productProxy = createProxyMiddleware({
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/'
  },
  onError: (err, req, res) => {
    console.error('Product Service Error:', err);
    res.status(500).json({ error: 'Product Service is not available' });
  },
  proxyTimeout: 5000,
  timeout: 5000
});

// Routes
app.use('/api/customers', customerProxy);
app.use('/api/orders', orderProxy);
app.use('/api/products', productProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
}); 
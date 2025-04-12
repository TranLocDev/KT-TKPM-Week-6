const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for testing
let orders = [
    { id: 1, customerId: 1, products: [1, 2], total: 150 },
    { id: 2, customerId: 2, products: [3], total: 50 }
];

// Routes
// Get all orders
app.get('/', (req, res) => {
    res.json(orders);
});

// Get order by ID
app.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
});

// Create new order
app.post('/', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        customerId: req.body.customerId,
        products: req.body.products,
        total: req.body.total
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update order
app.put('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.customerId = req.body.customerId || order.customerId;
    order.products = req.body.products || order.products;
    order.total = req.body.total || order.total;
    res.json(order);
});

// Delete order
app.delete('/:id', (req, res) => {
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    orders.splice(index, 1);
    res.json({ message: 'Order deleted' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Order Service' });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
}); 
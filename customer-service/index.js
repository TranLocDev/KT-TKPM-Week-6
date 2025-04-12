const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for testing
let customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
// Get all customers
app.get('/', (req, res) => {
    res.json(customers);
});

// Get customer by ID
app.get('/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
});

// Create new customer
app.post('/', (req, res) => {
    const newCustomer = {
        id: customers.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});

// Update customer
app.put('/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    res.json(customer);
});

// Delete customer
app.delete('/:id', (req, res) => {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Customer not found' });

    customers.splice(index, 1);
    res.json({ message: 'Customer deleted' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Customer Service' });
});

app.listen(PORT, () => {
    console.log(`Customer Service running on port ${PORT}`);
}); 
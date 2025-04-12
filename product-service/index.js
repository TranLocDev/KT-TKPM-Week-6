const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./connectDB');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));

// Increase JSON payload limit
app.use(express.json({ limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Payload too large' });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    res.status(500).json({ error: 'Something went wrong' });
});

// Insert sample data
app.post('/insert-sample', async (req, res) => {
    try {
        const sampleProduct = new Product({
            name: "iPhone 15 Pro",
            price: 999,
            stock: 50
        });
        
        const savedProduct = await sampleProduct.save();
        res.status(201).json({
            message: "Sample product inserted successfully",
            product: savedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes
// Get all products
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get product by ID
app.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new product
app.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.price || !req.body.stock) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Create product error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

// Update product
app.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete product
app.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Product Service',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

const server = app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
}); 
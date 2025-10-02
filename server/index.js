const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check with database status
app.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();
    res.status(200).json({ 
        status: 'OK', 
        database: dbStatus ? 'connected' : 'disconnected'
    });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as time');
        res.json({ 
            message: 'Database working',
            time: result.rows[0].time
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database connection failed'
        });
    }
});

// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Retail Intelligence API is operational',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Resource not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Health check: http://localhost:' + PORT + '/health');
    console.log('Database test: http://localhost:' + PORT + '/api/db-test');
    console.log('API test: http://localhost:' + PORT + '/api/test');
});
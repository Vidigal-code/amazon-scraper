import express from 'express';
import cors from 'cors';
import { scrapeAmazonProducts } from './scraper.js';
import dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 3000;
const API_GET_SCRAPE = process.env.API_GET_SCRAPE || '/api/scrape';

// Start Server
const app = express();

// Middleware
app.use(cors());

// Scraping endpoint
app.get(API_GET_SCRAPE, (req, res, next) => {
    const { keyword } = req.query;

    // Validate query parameter `keyword`
    if (!keyword) {
        return res.status(400).json({
            error: 'Keyword is required'
        });
    }

    // Start scraping process and handle promise resolution or rejection
    scrapeAmazonProducts(keyword)
        .then((products) => {
            // Respond with the list of products
            res.json(products);
            // Display success message with green color and smiley emoji :)
            console.log('\x1b[32m\nScraping success: 🙂 Products fetched!\x1b[0m\n');
        })
        .catch((error) => {
            // If error occurs, pass it to error-handling middleware
            next(error);
        });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
    console.log(`\x1b[31mScraping error:😞 ${err.message}\x1b[0m`);

    // Respond with a generic error message and error details
    res.status(500).json({
        error: 'Failed to scrape Amazon products',
        details: err.message || 'Unknown error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`\x1b[32mServer running on ${HOST}:${PORT}\x1b[0m`);
    console.log(`\x1b[34m🚀 Amazon Scraper By https://github.com/Vidigal-code\x1b[0m`);
});

import express from 'express';
import axios from 'axios';
import { createLogger } from 'winston';

const router = express.Router();
const logger = createLogger();

// Configuration Google Books API
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Cache en mémoire simple (à remplacer par Redis en production)
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 heure

router.get('/search', async (req, res) => {
  try {
    const { q, maxResults = 10 } = req.query;
    const cacheKey = `search:${q}:${maxResults}`;

    // Vérifier le cache
    const cached = cache.get(cacheKey);
    if (cached && cached.timestamp > Date.now() - CACHE_DURATION) {
      return res.json(cached.data);
    }

    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q,
        maxResults,
        key: process.env.GOOGLE_BOOKS_API_KEY
      }
    });

    // Mise en cache
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: response.data
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Google Books API error:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche de livres' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `book:${id}`;

    const cached = cache.get(cacheKey);
    if (cached && cached.timestamp > Date.now() - CACHE_DURATION) {
      return res.json(cached.data);
    }

    const response = await axios.get(`${GOOGLE_BOOKS_API}/${id}`, {
      params: {
        key: process.env.GOOGLE_BOOKS_API_KEY
      }
    });

    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: response.data
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Google Books API error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du livre' });
  }
});

export default router;
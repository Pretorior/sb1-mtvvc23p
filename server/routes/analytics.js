import express from 'express';
import axios from 'axios';
import { createLogger } from 'winston';

const router = express.Router();
const logger = createLogger();

// Configuration Plausible
const plausible = axios.create({
  baseURL: 'https://plausible.io/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.PLAUSIBLE_API_TOKEN}`
  }
});

router.post('/event', async (req, res) => {
  try {
    const { name, url, props } = req.body;

    await plausible.post('/event', {
      name,
      url,
      domain: process.env.PLAUSIBLE_DOMAIN,
      props
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Plausible API error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'événement' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { period } = req.query;

    const response = await plausible.get('/stats/aggregate', {
      params: {
        site_id: process.env.PLAUSIBLE_DOMAIN,
        period,
        metrics: 'visitors,pageviews,bounce_rate,visit_duration'
      }
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Plausible API error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
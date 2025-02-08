import express from 'express';
import { ServerClient } from 'postmark';
import axios from 'axios';
import { createLogger } from 'winston';

const router = express.Router();
const logger = createLogger();

// Configuration Postmark avec vérification de la clé API
const postmarkToken = process.env.POSTMARK_API_TOKEN;
const postmark = postmarkToken ? new ServerClient(postmarkToken) : null;

// Configuration MailerLite avec vérification de la clé API
const mailerLiteToken = process.env.MAILERLITE_API_KEY;
const mailerLite = mailerLiteToken ? axios.create({
  baseURL: 'https://api.mailerlite.com/api/v2',
  headers: {
    'X-MailerLite-ApiKey': mailerLiteToken
  }
}) : null;

router.post('/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!postmark) {
      logger.warn('Postmark API token not configured - email service disabled');
      return res.status(503).json({ 
        error: 'Service temporairement indisponible',
        message: 'Le service d\'email est actuellement désactivé'
      });
    }

    await postmark.sendEmailWithTemplate({
      From: 'welcome@biblioshere.app',
      To: email,
      TemplateId: 'welcome-email',
      TemplateModel: {
        name: name,
        action_url: `${process.env.FRONTEND_URL}/getting-started`
      }
    });

    res.json({ message: 'Email de bienvenue envoyé' });
  } catch (error) {
    logger.error('Postmark API error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    if (!mailerLite) {
      logger.warn('MailerLite API token not configured - newsletter service disabled');
      return res.status(503).json({ 
        error: 'Service temporairement indisponible',
        message: 'Le service de newsletter est actuellement désactivé'
      });
    }

    const response = await mailerLite.post('/subscribers', {
      email,
      name,
      fields: preferences
    });

    res.json(response.data);
  } catch (error) {
    logger.error('MailerLite API error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'inscription à la newsletter',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
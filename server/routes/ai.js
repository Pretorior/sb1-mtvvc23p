import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import { createLogger, format, transports } from 'winston';

const router = express.Router();
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Vérification des clés API requises
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY is not set. OpenAI features will be disabled.');
}

if (!MISTRAL_API_KEY) {
  logger.warn('MISTRAL_API_KEY is not set. Mistral features will be disabled.');
}

// Configuration OpenAI (seulement si la clé est disponible)
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// Configuration Mistral (seulement si la clé est disponible)
const mistralAxios = MISTRAL_API_KEY ? axios.create({
  baseURL: 'https://api.mistral.ai/v1',
  headers: {
    'Authorization': `Bearer ${MISTRAL_API_KEY}`
  }
}) : null;

router.post('/recommendations', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ 
      error: 'Service OpenAI non disponible',
      message: 'Le service de recommandations est temporairement indisponible.'
    });
  }

  try {
    const { genres, mood, recentBooks } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Vous êtes un expert littéraire spécialisé dans les recommandations personnalisées."
        },
        {
          role: "user",
          content: `Recommande 5 livres basés sur ces critères:
            Genres: ${genres.join(', ')}
            Humeur: ${mood}
            Lectures récentes: ${recentBooks.join(', ')}
            
            Format: JSON avec titre, auteur, raison de la recommandation et score de correspondance.`
        }
      ]
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    logger.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération des recommandations',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/analysis', async (req, res) => {
  if (!mistralAxios) {
    return res.status(503).json({ 
      error: 'Service Mistral non disponible',
      message: 'Le service d\'analyse est temporairement indisponible.'
    });
  }

  try {
    const { text } = req.body;

    const response = await mistralAxios.post('/chat/completions', {
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "Analysez le texte fourni et donnez un retour détaillé sur le style, les thèmes et le sentiment général."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Mistral API error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'analyse du texte',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint de fallback pour les recommandations
router.post('/recommendations/fallback', async (req, res) => {
  try {
    const { genres, mood } = req.body;
    
    // Logique de recommandation simple basée sur des règles
    const recommendations = [
      {
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        reason: "Un classique intemporel qui parle à tous",
        matchScore: 90
      },
      {
        title: "1984",
        author: "George Orwell",
        reason: "Une œuvre majeure de la littérature",
        matchScore: 85
      }
      // Ajoutez d'autres recommandations par défaut
    ];

    res.json(recommendations);
  } catch (error) {
    logger.error('Fallback recommendations error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des recommandations de secours' });
  }
});

export default router;
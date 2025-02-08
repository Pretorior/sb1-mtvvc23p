import { Configuration, OpenAIApi } from 'openai';
import { supabase } from '../lib/supabase';

class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateBookRecommendations(
    userId: string,
    preferences: {
      genres: string[];
      favoriteAuthors?: string[];
      recentlyRead?: string[];
      mood?: string;
      themes?: string[];
    }
  ) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('reading_preferences')
        .eq('id', userId)
        .single();

      const prompt = `En tant qu'expert littéraire, recommande 5 livres pour un lecteur avec les préférences suivantes:
        - Genres préférés: ${preferences.genres.join(', ')}
        ${preferences.favoriteAuthors ? `- Auteurs appréciés: ${preferences.favoriteAuthors.join(', ')}` : ''}
        ${preferences.recentlyRead ? `- Lectures récentes: ${preferences.recentlyRead.join(', ')}` : ''}
        ${preferences.mood ? `- Humeur actuelle: ${preferences.mood}` : ''}
        ${preferences.themes ? `- Thèmes recherchés: ${preferences.themes.join(', ')}` : ''}
        
        Format de réponse souhaité:
        [
          {
            "title": "Titre du livre",
            "author": "Nom de l'auteur",
            "reason": "Raison de la recommandation",
            "matchScore": 95
          }
        ]`;

      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert littéraire spécialisé dans les recommandations personnalisées."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const recommendations = JSON.parse(response.data.choices[0].message?.content || '[]');

      // Sauvegarder les recommandations dans Supabase
      await supabase.from('recommendations').insert(
        recommendations.map((rec: any) => ({
          user_id: userId,
          title: rec.title,
          author: rec.author,
          reason: rec.reason,
          match_score: rec.matchScore,
          created_at: new Date()
        }))
      );

      return recommendations;

    } catch (error) {
      console.error('Erreur lors de la génération des recommandations:', error);
      throw error;
    }
  }

  async analyzeBookSentiment(reviews: string[]) {
    try {
      const prompt = `Analyser le sentiment général et les thèmes principaux des avis suivants sur un livre:

      Avis:
      ${reviews.join('\n\n')}

      Format de réponse souhaité:
      {
        "sentiment": "positif" | "négatif" | "mitigé",
        "score": 0-100,
        "themes": ["thème1", "thème2"],
        "keyPoints": {
          "positifs": ["point1", "point2"],
          "négatifs": ["point1", "point2"]
        }
      }`;

      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en analyse de sentiment et de contenu littéraire."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      });

      return JSON.parse(response.data.choices[0].message?.content || '{}');

    } catch (error) {
      console.error('Erreur lors de l\'analyse des sentiments:', error);
      throw error;
    }
  }

  async generateDiscussionPrompts(bookTitle: string, genre: string) {
    try {
      const prompt = `Générer 5 questions de discussion pertinentes pour le livre "${bookTitle}" (genre: ${genre}).
      Les questions doivent encourager la réflexion et la discussion approfondie.
      
      Format de réponse souhaité:
      [
        {
          "question": "La question",
          "context": "Contexte ou élément déclencheur",
          "themes": ["thème1", "thème2"]
        }
      ]`;

      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Vous êtes un animateur de club de lecture expérimenté."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return JSON.parse(response.data.choices[0].message?.content || '[]');

    } catch (error) {
      console.error('Erreur lors de la génération des questions:', error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();
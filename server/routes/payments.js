import express from 'express';
import Stripe from 'stripe';
import { createLogger } from 'winston';

const router = express.Router();
const logger = createLogger();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', bookId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Conversion en centimes
      currency,
      metadata: {
        bookId,
        userId: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    logger.error('Stripe API error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du paiement' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Mettre à jour le statut de la commande dans Supabase
        break;

      case 'payment_intent.payment_failed':
        // Gérer l'échec du paiement
        break;
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
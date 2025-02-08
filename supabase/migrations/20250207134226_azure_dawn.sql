/*
  # Création des tables pour les fonctionnalités sociales

  1. Tables créées
    - `follows` : Gestion des abonnements entre utilisateurs
      - `follower_id` (uuid, référence profiles)
      - `following_id` (uuid, référence profiles)
      - `created_at` (timestamptz)
    
    - `reviews` : Avis sur les livres
      - `id` (uuid, clé primaire)
      - `book_id` (uuid, référence books)
      - `user_id` (uuid, référence profiles)
      - `content` (text)
      - `rating` (integer)
      - `visibility` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `review_likes` : Likes sur les avis
      - `review_id` (uuid, référence reviews)
      - `user_id` (uuid, référence profiles)
      - `created_at` (timestamptz)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour lecture/écriture basées sur l'authentification et la visibilité
*/

-- Table des abonnements
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Table des avis
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  visibility text DEFAULT 'public',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des likes sur les avis
CREATE TABLE IF NOT EXISTS review_likes (
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (review_id, user_id)
);

-- Activer RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- Politiques pour les abonnements
CREATE POLICY "Users can view follows"
  ON follows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Politiques pour les avis
CREATE POLICY "Users can view public reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'public' OR
    auth.uid() = user_id OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM follows
      WHERE (follower_id = auth.uid() AND following_id = reviews.user_id)
      OR (following_id = auth.uid() AND follower_id = reviews.user_id)
    ))
  );

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques pour les likes
CREATE POLICY "Users can view review likes"
  ON review_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like reviews"
  ON review_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike reviews"
  ON review_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
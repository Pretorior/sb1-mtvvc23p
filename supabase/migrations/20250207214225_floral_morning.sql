/*
  # Système de badges de lecture

  1. Nouvelles Tables
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `icon` (text)
      - `requirements` (jsonb)
      - `created_at` (timestamptz)
    
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `badge_id` (uuid, references badges)
      - `progress` (integer)
      - `unlocked_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and managing badges
*/

-- Table des badges
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('reading', 'social', 'collection', 'achievement')),
  icon text NOT NULL,
  requirements jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table des badges utilisateur
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies pour les badges
CREATE POLICY "Badges are viewable by everyone"
  ON badges
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies pour les badges utilisateur
CREATE POLICY "Users can view their own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own badge progress"
  ON user_badges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insérer les badges par défaut
INSERT INTO badges (name, description, category, icon, requirements) VALUES
  (
    'Lecteur Débutant',
    'Lire son premier livre',
    'reading',
    'BookOpen',
    '{"books_read": 1}'
  ),
  (
    'Lecteur Assidu',
    'Lire 10 livres',
    'reading',
    'BookOpen',
    '{"books_read": 10}'
  ),
  (
    'Lecteur Expert',
    'Lire 50 livres',
    'reading',
    'BookOpen',
    '{"books_read": 50}'
  ),
  (
    'Marathon Lecture',
    'Lire pendant 24 heures au total',
    'reading',
    'Clock',
    '{"reading_time": 1440}'
  ),
  (
    'Rat de Bibliothèque',
    'Lire 5000 pages',
    'reading',
    'BookOpen',
    '{"pages_read": 5000}'
  ),
  (
    'Série Parfaite',
    'Maintenir une série de lecture de 7 jours',
    'achievement',
    'Flame',
    '{"streak_days": 7}'
  ),
  (
    'Critique Littéraire',
    'Écrire 10 critiques de livres',
    'social',
    'MessageSquare',
    '{"reviews_written": 10}'
  ),
  (
    'Collectionneur',
    'Ajouter 100 livres à sa bibliothèque',
    'collection',
    'Library',
    '{"books_collected": 100}'
  ),
  (
    'Explorateur de Genres',
    'Lire des livres de 5 genres différents',
    'reading',
    'Compass',
    '{"unique_genres": 5}'
  ),
  (
    'Lecteur Social',
    'Rejoindre 3 clubs de lecture',
    'social',
    'Users',
    '{"reading_groups": 3}'
  );

-- Fonction pour vérifier et attribuer les badges
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS trigger AS $$
DECLARE
  badge record;
  user_stats jsonb;
BEGIN
  -- Récupérer les statistiques de l'utilisateur
  SELECT json_build_object(
    'books_read', (
      SELECT count(*) 
      FROM books 
      WHERE user_id = NEW.user_id AND status = 'completed'
    ),
    'pages_read', (
      SELECT sum(pages_read) 
      FROM reading_sessions 
      WHERE user_id = NEW.user_id
    ),
    'reading_time', (
      SELECT sum(duration) 
      FROM reading_sessions 
      WHERE user_id = NEW.user_id
    ),
    'streak_days', (
      SELECT max(streak) 
      FROM (
        SELECT count(*) as streak
        FROM reading_sessions
        WHERE user_id = NEW.user_id
        GROUP BY date_trunc('day', date)
      ) s
    ),
    'reviews_written', (
      SELECT count(*) 
      FROM reviews 
      WHERE user_id = NEW.user_id
    ),
    'books_collected', (
      SELECT count(*) 
      FROM books 
      WHERE user_id = NEW.user_id
    ),
    'unique_genres', (
      SELECT count(DISTINCT genre)
      FROM books
      WHERE user_id = NEW.user_id
    ),
    'reading_groups', (
      SELECT count(*)
      FROM reading_group_members
      WHERE user_id = NEW.user_id
    )
  ) INTO user_stats;

  -- Vérifier chaque badge
  FOR badge IN SELECT * FROM badges LOOP
    -- Vérifier si l'utilisateur a déjà le badge
    IF NOT EXISTS (
      SELECT 1 FROM user_badges
      WHERE user_id = NEW.user_id AND badge_id = badge.id
    ) THEN
      -- Vérifier si les conditions sont remplies
      IF check_badge_requirements(badge.requirements, user_stats) THEN
        -- Attribuer le badge
        INSERT INTO user_badges (user_id, badge_id, progress, unlocked_at)
        VALUES (NEW.user_id, badge.id, 100, now());
      END IF;
    END IF;
  END FOR;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier les conditions d'un badge
CREATE OR REPLACE FUNCTION check_badge_requirements(requirements jsonb, stats jsonb)
RETURNS boolean AS $$
DECLARE
  req record;
BEGIN
  FOR req IN SELECT * FROM jsonb_each(requirements) LOOP
    IF (stats->>req.key)::int < req.value::int THEN
      RETURN false;
    END IF;
  END FOR;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour vérifier les badges après chaque session de lecture
CREATE TRIGGER check_badges_after_reading_session
  AFTER INSERT OR UPDATE ON reading_sessions
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_badges();

-- Trigger pour vérifier les badges après chaque nouvelle critique
CREATE TRIGGER check_badges_after_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_badges();
/*
  # Reading Tracker Tables

  1. New Tables
    - `reading_sessions`: Enregistre les sessions de lecture
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `book_id` (uuid, foreign key)
      - `date` (timestamptz)
      - `duration` (integer, minutes)
      - `pages_read` (integer)
      - `notes` (text, optional)
      - `mood` (text, optional)
      - `location` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reading_goals`: Gère les objectifs de lecture
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text: 'books', 'pages', 'time')
      - `target` (integer)
      - `year` (integer)
      - `progress` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Table des sessions de lecture
CREATE TABLE IF NOT EXISTS reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  date timestamptz NOT NULL DEFAULT now(),
  duration integer NOT NULL CHECK (duration > 0),
  pages_read integer NOT NULL CHECK (pages_read > 0),
  notes text,
  mood text CHECK (mood IN ('focused', 'distracted', 'tired', 'energetic')),
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des objectifs de lecture
CREATE TABLE IF NOT EXISTS reading_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('books', 'pages', 'time')),
  target integer NOT NULL CHECK (target > 0),
  year integer NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, type, year)
);

-- Enable RLS
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

-- Policies pour reading_sessions
CREATE POLICY "Users can view their own reading sessions"
  ON reading_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading sessions"
  ON reading_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions"
  ON reading_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading sessions"
  ON reading_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies pour reading_goals
CREATE POLICY "Users can view their own reading goals"
  ON reading_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading goals"
  ON reading_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading goals"
  ON reading_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading goals"
  ON reading_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_reading_sessions_updated_at
  BEFORE UPDATE ON reading_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_goals_updated_at
  BEFORE UPDATE ON reading_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
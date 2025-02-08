/*
  # Add reading goals tables and policies

  1. New Tables
    - `reading_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, check constraint: books/pages/time)
      - `target` (integer)
      - `year` (integer)
      - `progress` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reading_goals`
    - Add policies for CRUD operations
*/

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
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

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

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_reading_goals_updated_at
  BEFORE UPDATE ON reading_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
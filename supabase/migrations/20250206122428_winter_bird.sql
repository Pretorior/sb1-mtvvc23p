/*
  # Create users and follows tables

  1. New Tables
    - `users` - User profiles extending auth.users
      - `id` (uuid) - Primary key, references auth.users
      - `name` (text) - User's display name
      - `avatar_url` (text) - Profile picture URL
      - `yearly_goal` (int) - Reading goal
      - `theme` (text) - UI theme preference
      - `language` (text) - Language preference
      - `online_status` (boolean) - Online status
      - `verified_at` (timestamptz) - Verification timestamp

    - `user_follows` - Social connections
      - `follower_id` (uuid) - References users.id
      - `following_id` (uuid) - References users.id
      - `notifications` (boolean) - Follow notifications

    - `user_preferences` - User settings
      - `user_id` (uuid) - References users.id
      - Various notification and privacy settings

  2. Security
    - Enable RLS on all tables
    - Add policies for profile visibility
    - Add policies for social interactions
*/

-- Create users table extending auth.users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  yearly_goal int DEFAULT 12,
  theme text DEFAULT 'system',
  language text DEFAULT 'fr',
  online_status boolean DEFAULT true,
  last_seen_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'system')),
  CONSTRAINT valid_language CHECK (language IN ('fr', 'en', 'es'))
);

-- Create user follows table
CREATE TABLE user_follows (
  follower_id uuid REFERENCES users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  notifications boolean DEFAULT true,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create user preferences table
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  reading_reminders boolean DEFAULT true,
  group_activity boolean DEFAULT true,
  friend_activity boolean DEFAULT true,
  marketing boolean DEFAULT false,
  profile_visibility text DEFAULT 'public',
  reading_activity text DEFAULT 'friends',
  library_visibility text DEFAULT 'friends',
  show_online_status boolean DEFAULT true,
  CONSTRAINT valid_visibility CHECK (
    profile_visibility IN ('public', 'friends', 'private') AND
    reading_activity IN ('public', 'friends', 'private') AND
    library_visibility IN ('public', 'friends', 'private')
  )
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view public profiles"
  ON users FOR SELECT
  USING (
    id = auth.uid() OR
    id IN (
      SELECT user_id FROM user_preferences 
      WHERE profile_visibility = 'public'
    ) OR
    id IN (
      SELECT user_id FROM user_preferences 
      WHERE profile_visibility = 'friends' AND
      user_id IN (SELECT following_id FROM user_follows WHERE follower_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policies for user_follows
CREATE POLICY "Users can view follows"
  ON user_follows FOR SELECT
  USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can manage their follows"
  ON user_follows FOR ALL
  USING (follower_id = auth.uid())
  WITH CHECK (follower_id = auth.uid());

-- Policies for user_preferences
CREATE POLICY "Users can view preferences of visible profiles"
  ON user_preferences FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM users 
      WHERE id IN (
        SELECT user_id FROM user_preferences 
        WHERE profile_visibility = 'public'
      )
    ) OR
    user_id IN (
      SELECT id FROM users 
      WHERE id IN (
        SELECT user_id FROM user_preferences 
        WHERE profile_visibility = 'friends'
      ) AND
      id IN (SELECT following_id FROM user_follows WHERE follower_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
/*
  # Social connections and blocking

  1. New Tables
    - `user_blocks` - User blocking system
      - `blocker_id` (uuid) - References users.id
      - `blocked_id` (uuid) - References users.id
      - `reason` (text) - Optional blocking reason
      - `created_at` (timestamptz) - Block timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for blocking management
    - Add functions for block/unblock operations

  3. Functions
    - `block_user()` - Block/unblock users
*/

-- Create user blocks table
CREATE TABLE user_blocks (
  blocker_id uuid REFERENCES users(id) ON DELETE CASCADE,
  blocked_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)
);

-- Enable RLS
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

-- Policies for user_blocks
CREATE POLICY "Users can view their own blocks"
  ON user_blocks FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks"
  ON user_blocks FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can delete their own blocks"
  ON user_blocks FOR DELETE
  USING (blocker_id = auth.uid());

-- Function to handle block/unblock
CREATE OR REPLACE FUNCTION block_user(target_id uuid, block_reason text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Check if target user exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = target_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Remove any existing follow relationships
  DELETE FROM user_follows 
  WHERE (follower_id = auth.uid() AND following_id = target_id) OR
        (follower_id = target_id AND following_id = auth.uid());

  -- Add or remove block
  IF EXISTS (
    SELECT 1 FROM user_blocks 
    WHERE blocker_id = auth.uid() AND blocked_id = target_id
  ) THEN
    DELETE FROM user_blocks 
    WHERE blocker_id = auth.uid() AND blocked_id = target_id;
  ELSE
    INSERT INTO user_blocks (blocker_id, blocked_id, reason)
    VALUES (auth.uid(), target_id, block_reason);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
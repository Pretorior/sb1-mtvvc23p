/*
  # Shelves Management

  1. New Tables
    - `shelves` - User's book shelves
      - `id` (uuid) - Primary key
      - `user_id` (uuid) - References users.id
      - `name` (text) - Shelf name
      - `description` (text) - Optional description
      - `visibility` (text) - public/friends/private
    
    - `shelf_books` - Books in shelves
      - `shelf_id` (uuid) - References shelves.id
      - `book_id` (uuid) - References books.id
    
    - `shelf_follows` - Shelf followers
      - `shelf_id` (uuid) - References shelves.id
      - `user_id` (uuid) - References users.id

  2. Security
    - Enable RLS on all tables
    - Add policies for shelf management
    - Add policies for shelf follows

  3. Functions
    - `toggle_shelf_follow()` - Follow/unfollow shelf
*/

-- Create shelves table
CREATE TABLE shelves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  visibility text NOT NULL DEFAULT 'public',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_visibility CHECK (
    visibility IN ('public', 'friends', 'private')
  )
);

-- Create shelf books table
CREATE TABLE shelf_books (
  shelf_id uuid REFERENCES shelves(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (shelf_id, book_id)
);

-- Create shelf follows table
CREATE TABLE shelf_follows (
  shelf_id uuid REFERENCES shelves(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (shelf_id, user_id)
);

-- Enable RLS
ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_follows ENABLE ROW LEVEL SECURITY;

-- Policies for shelves
CREATE POLICY "Users can view public shelves and friends' shelves"
  ON shelves FOR SELECT
  USING (
    user_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'friends' AND user_id IN (
      SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create their own shelves"
  ON shelves FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own shelves"
  ON shelves FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own shelves"
  ON shelves FOR DELETE
  USING (user_id = auth.uid());

-- Policies for shelf_books
CREATE POLICY "Users can view books in visible shelves"
  ON shelf_books FOR SELECT
  USING (
    shelf_id IN (
      SELECT id FROM shelves WHERE
        user_id = auth.uid() OR
        visibility = 'public' OR
        (visibility = 'friends' AND user_id IN (
          SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
        ))
    )
  );

CREATE POLICY "Users can manage books in their shelves"
  ON shelf_books FOR ALL
  USING (
    shelf_id IN (
      SELECT id FROM shelves WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    shelf_id IN (
      SELECT id FROM shelves WHERE user_id = auth.uid()
    )
  );

-- Policies for shelf_follows
CREATE POLICY "Users can view shelf follows"
  ON shelf_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow/unfollow public shelves"
  ON shelf_follows FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    shelf_id IN (
      SELECT id FROM shelves WHERE
        visibility = 'public' OR
        (visibility = 'friends' AND user_id IN (
          SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
        ))
    )
  );

CREATE POLICY "Users can remove their follows"
  ON shelf_follows FOR DELETE
  USING (user_id = auth.uid());

-- Update trigger
CREATE TRIGGER update_shelves_updated_at
  BEFORE UPDATE ON shelves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to follow/unfollow shelf
CREATE OR REPLACE FUNCTION toggle_shelf_follow(shelf_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Check if shelf exists and is visible
  IF NOT EXISTS (
    SELECT 1 FROM shelves 
    WHERE id = shelf_id_param AND (
      visibility = 'public' OR
      (visibility = 'friends' AND user_id IN (
        SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
      ))
    )
  ) THEN
    RAISE EXCEPTION 'Shelf not found or not visible';
  END IF;

  -- Toggle follow
  IF EXISTS (
    SELECT 1 FROM shelf_follows
    WHERE shelf_id = shelf_id_param AND user_id = auth.uid()
  ) THEN
    DELETE FROM shelf_follows
    WHERE shelf_id = shelf_id_param AND user_id = auth.uid();
  ELSE
    INSERT INTO shelf_follows (shelf_id, user_id)
    VALUES (shelf_id_param, auth.uid());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
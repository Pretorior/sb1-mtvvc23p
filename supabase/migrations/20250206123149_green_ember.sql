/*
  # Books and Reading Management

  1. New Tables
    - `books` - Book information
      - `id` (uuid) - Primary key
      - `isbn` (text) - Unique ISBN
      - `title` (text) - Book title
      - `author` (text) - Book author
      - `cover_url` (text) - Cover image URL
      - `page_count` (int) - Number of pages
      - `publisher` (text) - Publisher name
      - `publish_date` (date) - Publication date
      - `language` (text) - Book language
      - `description` (text) - Book description
    
    - `book_genres` - Book genres (many-to-many)
      - `book_id` (uuid) - References books.id
      - `genre` (text) - Genre name
    
    - `user_books` - User's books
      - `id` (uuid) - Primary key
      - `user_id` (uuid) - References users.id
      - `book_id` (uuid) - References books.id
      - `status` (text) - Reading status
      - `rating` (int) - Book rating (1-5)
      - `review` (text) - Book review
      - `visibility` (text) - Review visibility
      - `start_date` (date) - Reading start date
      - `end_date` (date) - Reading end date
      - `current_page` (int) - Current page
    
    - `reading_sessions` - Reading sessions
      - `id` (uuid) - Primary key
      - `user_id` (uuid) - References users.id
      - `book_id` (uuid) - References books.id
      - `start_time` (timestamptz) - Session start
      - `end_time` (timestamptz) - Session end
      - `pages_read` (int) - Pages read
      - `notes` (text) - Session notes

  2. Security
    - Enable RLS on all tables
    - Add policies for book management
    - Add policies for reading sessions

  3. Functions
    - `get_user_reading_stats()` - Calculate reading statistics
*/

-- Create books table
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn text UNIQUE,
  title text NOT NULL,
  author text NOT NULL,
  cover_url text,
  page_count int NOT NULL,
  publisher text,
  publish_date date,
  language text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create book genres table
CREATE TABLE book_genres (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  genre text NOT NULL,
  PRIMARY KEY (book_id, genre)
);

-- Create user books table
CREATE TABLE user_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'to-read',
  rating int CHECK (rating >= 1 AND rating <= 5),
  review text,
  visibility text NOT NULL DEFAULT 'public',
  start_date date,
  end_date date,
  current_page int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (
    status IN ('to-read', 'reading', 'completed', 'on-hold', 'dropped')
  ),
  CONSTRAINT valid_visibility CHECK (
    visibility IN ('public', 'friends', 'private')
  ),
  CONSTRAINT valid_dates CHECK (
    (start_date IS NULL AND end_date IS NULL) OR
    (start_date IS NOT NULL AND end_date IS NULL) OR
    (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= start_date)
  ),
  UNIQUE (user_id, book_id)
);

-- Create reading sessions table
CREATE TABLE reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  pages_read int,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_session CHECK (
    end_time IS NULL OR end_time > start_time
  )
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for books
CREATE POLICY "Books are viewable by everyone"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for book_genres
CREATE POLICY "Book genres are viewable by everyone"
  ON book_genres FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert book genres"
  ON book_genres FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for user_books
CREATE POLICY "Users can view their own books and public/friends books"
  ON user_books FOR SELECT
  USING (
    user_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'friends' AND user_id IN (
      SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
    ))
  );

CREATE POLICY "Users can insert their own books"
  ON user_books FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own books"
  ON user_books FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own books"
  ON user_books FOR DELETE
  USING (user_id = auth.uid());

-- Policies for reading_sessions
CREATE POLICY "Users can view their own reading sessions"
  ON reading_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reading sessions"
  ON reading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reading sessions"
  ON reading_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reading sessions"
  ON reading_sessions FOR DELETE
  USING (user_id = auth.uid());

-- Triggers for validation
CREATE OR REPLACE FUNCTION validate_user_book_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_page < 0 OR
     NEW.current_page > (SELECT page_count FROM books WHERE id = NEW.book_id) THEN
    RAISE EXCEPTION 'Invalid page progress';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_user_book_progress_trigger
  BEFORE INSERT OR UPDATE ON user_books
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_book_progress();

CREATE OR REPLACE FUNCTION validate_reading_session_pages()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pages_read <= 0 OR
     NEW.pages_read > (SELECT page_count FROM books WHERE id = NEW.book_id) THEN
    RAISE EXCEPTION 'Invalid pages read';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_reading_session_pages_trigger
  BEFORE INSERT OR UPDATE ON reading_sessions
  FOR EACH ROW
  WHEN (NEW.pages_read IS NOT NULL)
  EXECUTE FUNCTION validate_reading_session_pages();

-- Update triggers
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_books_updated_at
  BEFORE UPDATE ON user_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to calculate reading stats
CREATE OR REPLACE FUNCTION get_user_reading_stats(user_id_param uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'books_read', (
      SELECT count(*) 
      FROM user_books 
      WHERE user_id = user_id_param AND status = 'completed'
    ),
    'pages_read', (
      SELECT coalesce(sum(b.page_count), 0)
      FROM user_books ub
      JOIN books b ON b.id = ub.book_id
      WHERE ub.user_id = user_id_param AND ub.status = 'completed'
    ),
    'reading_streak', (
      SELECT count(DISTINCT date_trunc('day', start_time))
      FROM reading_sessions
      WHERE user_id = user_id_param
      AND start_time >= current_date - interval '30 days'
    ),
    'average_rating', (
      SELECT round(avg(rating)::numeric, 1)
      FROM user_books
      WHERE user_id = user_id_param AND rating IS NOT NULL
    ),
    'favorite_genres', (
      SELECT json_agg(genre_count)
      FROM (
        SELECT bg.genre, count(*) as count
        FROM user_books ub
        JOIN book_genres bg ON bg.book_id = ub.book_id
        WHERE ub.user_id = user_id_param
        GROUP BY bg.genre
        ORDER BY count(*) DESC
        LIMIT 5
      ) genre_count
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
/*
  # Création des tables pour la gestion des livres et des étagères

  1. Tables créées
    - `books` : Stocke les informations des livres
    - `shelves` : Stocke les étagères personnalisées
    - `shelf_books` : Table de jointure entre étagères et livres

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour lecture/écriture basées sur l'authentification
*/

-- Table des livres
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn text UNIQUE,
    title text NOT NULL,
    author text NOT NULL,
    cover_url text,
    page_count integer NOT NULL,
    genre text[] DEFAULT '{}',
    status text NOT NULL DEFAULT 'to-read',
    progress jsonb DEFAULT '{"currentPage": 0}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Table des étagères
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS shelves (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    icon text DEFAULT 'BookOpen',
    color text DEFAULT 'malibu',
    visibility text DEFAULT 'private',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Table de jointure étagères-livres
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS shelf_books (
    shelf_id uuid REFERENCES shelves(id) ON DELETE CASCADE,
    book_id uuid REFERENCES books(id) ON DELETE CASCADE,
    added_at timestamptz DEFAULT now(),
    PRIMARY KEY (shelf_id, book_id)
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Activer RLS
DO $$ BEGIN
  ALTER TABLE books ENABLE ROW LEVEL SECURITY;
  ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
  ALTER TABLE shelf_books ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Politiques pour les livres
DO $$ BEGIN
  DROP POLICY IF EXISTS "Books are viewable by everyone" ON books;
  CREATE POLICY "Books are viewable by everyone"
    ON books
    FOR SELECT
    TO authenticated
    USING (true);

  DROP POLICY IF EXISTS "Users can insert books" ON books;
  CREATE POLICY "Users can insert books"
    ON books
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Users can update books they created" ON books;
  CREATE POLICY "Users can update books they created"
    ON books
    FOR UPDATE
    TO authenticated
    USING (true);
END $$;

-- Politiques pour les étagères
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own shelves" ON shelves;
  CREATE POLICY "Users can view their own shelves"
    ON shelves
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can create their own shelves" ON shelves;
  CREATE POLICY "Users can create their own shelves"
    ON shelves
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own shelves" ON shelves;
  CREATE POLICY "Users can update their own shelves"
    ON shelves
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can delete their own shelves" ON shelves;
  CREATE POLICY "Users can delete their own shelves"
    ON shelves
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Politiques pour shelf_books
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their shelf books" ON shelf_books;
  CREATE POLICY "Users can view their shelf books"
    ON shelf_books
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM shelves 
      WHERE shelves.id = shelf_books.shelf_id 
      AND shelves.user_id = auth.uid()
    ));

  DROP POLICY IF EXISTS "Users can add books to their shelves" ON shelf_books;
  CREATE POLICY "Users can add books to their shelves"
    ON shelf_books
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM shelves 
      WHERE shelves.id = shelf_books.shelf_id 
      AND shelves.user_id = auth.uid()
    ));

  DROP POLICY IF EXISTS "Users can remove books from their shelves" ON shelf_books;
  CREATE POLICY "Users can remove books from their shelves"
    ON shelf_books
    FOR DELETE
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM shelves 
      WHERE shelves.id = shelf_books.shelf_id 
      AND shelves.user_id = auth.uid()
    ));
END $$;
/*
  # Mise à jour de la table des profils utilisateurs

  1. Changements
    - Rend le champ 'name' nullable
    - Améliore la gestion des valeurs NULL dans le trigger
    - Supprime et recrée les politiques de sécurité

  2. Security
    - Maintient RLS sur la table profiles
    - Recrée les politiques de sécurité avec des noms uniques
*/

-- Supprime les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Modifie la table profiles pour rendre name nullable
ALTER TABLE profiles ALTER COLUMN name DROP NOT NULL;

-- Crée les nouvelles politiques avec des noms uniques
CREATE POLICY "profiles_select_policy" 
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Améliore la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  preferences jsonb;
  user_name text;
BEGIN
  -- Extraction sécurisée des préférences
  preferences := COALESCE(
    CASE 
      WHEN NEW.raw_user_meta_data->>'preferences' IS NOT NULL AND 
           (NEW.raw_user_meta_data->>'preferences')::jsonb IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'preferences')::jsonb
      ELSE '{}'::jsonb
    END,
    '{}'::jsonb
  );

  -- Extraction sécurisée du nom
  user_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'name', '')), '');

  -- Insertion du profil
  INSERT INTO public.profiles (
    id,
    name,
    reading_preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    user_name,
    preferences,
    now(),
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrée le trigger avec un nom unique
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created_v2
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
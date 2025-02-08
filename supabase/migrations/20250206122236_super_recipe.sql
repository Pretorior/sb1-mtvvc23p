/*
  # Create community and social features tables

  1. New Tables
    - `reading_groups` - Book clubs and reading groups
      - `id` (uuid) - Primary key
      - `name` (text) - Group name
      - `description` (text) - Group description
      - `cover_url` (text) - Group cover image
      - `visibility` (text) - Group visibility
      - `created_by` (uuid) - References users.id
      - `created_at` (timestamptz) - Creation timestamp

    - `group_members` - Group membership
      - `group_id` (uuid) - References reading_groups.id
      - `user_id` (uuid) - References users.id
      - `role` (text) - Member role (admin/moderator/member)
      - `joined_at` (timestamptz) - Join timestamp
      - `status` (text) - Member status

    - `group_discussions` - Group discussion threads
      - `id` (uuid) - Primary key
      - `group_id` (uuid) - References reading_groups.id
      - `title` (text) - Discussion title
      - `content` (text) - Initial post content
      - `created_by` (uuid) - References users.id
      - `created_at` (timestamptz) - Creation timestamp
      - `locked` (boolean) - Whether thread is locked

    - `discussion_messages` - Discussion replies
      - `id` (uuid) - Primary key
      - `discussion_id` (uuid) - References group_discussions.id
      - `user_id` (uuid) - References users.id
      - `content` (text) - Message content
      - `created_at` (timestamptz) - Creation timestamp

    - `reading_challenges` - Reading challenges
      - `id` (uuid) - Primary key
      - `group_id` (uuid) - References reading_groups.id
      - `title` (text) - Challenge title
      - `description` (text) - Challenge description
      - `type` (text) - Challenge type (books/pages/genre)
      - `target` (int) - Target goal
      - `genre` (text) - For genre challenges
      - `start_date` (date) - Challenge start
      - `end_date` (date) - Challenge end

    - `challenge_participants` - Challenge participation
      - `challenge_id` (uuid) - References reading_challenges.id
      - `user_id` (uuid) - References users.id
      - `progress` (int) - Current progress
      - `joined_at` (timestamptz) - Join timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for group and challenge management
*/

-- Create reading groups table
CREATE TABLE reading_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_url text,
  visibility text NOT NULL DEFAULT 'public',
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_visibility CHECK (
    visibility IN ('public', 'private', 'invite-only')
  )
);

-- Create group members table
CREATE TABLE group_members (
  group_id uuid REFERENCES reading_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id),
  CONSTRAINT valid_role CHECK (
    role IN ('admin', 'moderator', 'member')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('active', 'warned', 'suspended')
  )
);

-- Create group discussions table
CREATE TABLE group_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES reading_groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  locked boolean NOT NULL DEFAULT false
);

-- Create discussion messages table
CREATE TABLE discussion_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES group_discussions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create reading challenges table
CREATE TABLE reading_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES reading_groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  target int NOT NULL,
  genre text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_type CHECK (
    type IN ('books', 'pages', 'genre')
  ),
  CONSTRAINT valid_dates CHECK (
    end_date >= start_date
  ),
  CONSTRAINT valid_target CHECK (
    target > 0
  )
);

-- Create challenge participants table
CREATE TABLE challenge_participants (
  challenge_id uuid REFERENCES reading_challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  progress int NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id),
  CONSTRAINT valid_progress CHECK (
    progress >= 0
  )
);

-- Enable RLS
ALTER TABLE reading_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Policies for reading_groups
CREATE POLICY "Users can view public groups"
  ON reading_groups FOR SELECT
  USING (
    visibility = 'public' OR
    id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update groups they admin"
  ON reading_groups FOR UPDATE
  USING (
    id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for group_members
CREATE POLICY "Users can view group members"
  ON group_members FOR SELECT
  USING (
    group_id IN (
      SELECT id FROM reading_groups WHERE
        visibility = 'public' OR
        id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage members"
  ON group_members FOR ALL
  USING (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for group_discussions
CREATE POLICY "Users can view discussions in accessible groups"
  ON group_discussions FOR SELECT
  USING (
    group_id IN (
      SELECT id FROM reading_groups WHERE
        visibility = 'public' OR
        id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Members can create discussions"
  ON group_discussions FOR INSERT
  TO authenticated
  WITH CHECK (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Authors and moderators can update discussions"
  ON group_discussions FOR UPDATE
  USING (
    created_by = auth.uid() OR
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    created_by = auth.uid() OR
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policies for discussion_messages
CREATE POLICY "Users can view messages in accessible discussions"
  ON discussion_messages FOR SELECT
  USING (
    discussion_id IN (
      SELECT id FROM group_discussions WHERE
        group_id IN (
          SELECT id FROM reading_groups WHERE
            visibility = 'public' OR
            id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Active members can create messages"
  ON discussion_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    discussion_id IN (
      SELECT id FROM group_discussions WHERE
        NOT locked AND
        group_id IN (
          SELECT group_id FROM group_members 
          WHERE user_id = auth.uid() AND status = 'active'
        )
    )
  );

CREATE POLICY "Authors and moderators can update messages"
  ON discussion_messages FOR UPDATE
  USING (
    user_id = auth.uid() OR
    discussion_id IN (
      SELECT id FROM group_discussions WHERE
        group_id IN (
          SELECT group_id FROM group_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
        )
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    discussion_id IN (
      SELECT id FROM group_discussions WHERE
        group_id IN (
          SELECT group_id FROM group_members 
          WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
        )
    )
  );

-- Policies for reading_challenges
CREATE POLICY "Users can view challenges in accessible groups"
  ON reading_challenges FOR SELECT
  USING (
    group_id IN (
      SELECT id FROM reading_groups WHERE
        visibility = 'public' OR
        id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Admins and moderators can manage challenges"
  ON reading_challenges FOR ALL
  USING (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    group_id IN (
      SELECT group_id FROM group_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policies for challenge_participants
CREATE POLICY "Users can view challenge participants"
  ON challenge_participants FOR SELECT
  USING (
    challenge_id IN (
      SELECT id FROM reading_challenges WHERE
        group_id IN (
          SELECT id FROM reading_groups WHERE
            visibility = 'public' OR
            id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Users can join/leave challenges"
  ON challenge_participants FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Update triggers
CREATE TRIGGER update_reading_groups_updated_at
  BEFORE UPDATE ON reading_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_group_discussions_updated_at
  BEFORE UPDATE ON group_discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discussion_messages_updated_at
  BEFORE UPDATE ON discussion_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Functions for group management
CREATE OR REPLACE FUNCTION join_group(group_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Check if group exists and is public
  IF NOT EXISTS (
    SELECT 1 FROM reading_groups 
    WHERE id = group_id_param AND visibility = 'public'
  ) THEN
    RAISE EXCEPTION 'Group not found or not public';
  END IF;

  -- Check if already a member
  IF EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = group_id_param AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already a member';
  END IF;

  -- Join group
  INSERT INTO group_members (group_id, user_id)
  VALUES (group_id_param, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION leave_group(group_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Check if last admin
  IF EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = group_id_param 
    AND user_id = auth.uid()
    AND role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_id_param
      AND user_id != auth.uid()
      AND role = 'admin'
    )
  ) THEN
    RAISE EXCEPTION 'Cannot leave group as last admin';
  END IF;

  -- Leave group
  DELETE FROM group_members
  WHERE group_id = group_id_param AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
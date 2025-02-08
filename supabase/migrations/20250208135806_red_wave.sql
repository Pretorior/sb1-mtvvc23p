/*
  # Create marketplace tables and policies

  1. New Tables
    - `listings` - For marketplace book listings
    - `orders` - For tracking purchases
    - `disputes` - For handling buyer/seller disputes
    - `dispute_messages` - For dispute communication
    - `dispute_evidence` - For dispute evidence files

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create marketplace tables
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  condition text NOT NULL,
  description text,
  location text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  initiator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'opened',
  resolution text,
  amount numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS dispute_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id uuid REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_from_support boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dispute_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id uuid REFERENCES disputes(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidence ENABLE ROW LEVEL SECURITY;

-- Listing policies
CREATE POLICY "listings_select_policy" ON listings
  FOR SELECT TO authenticated
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "listings_insert_policy" ON listings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "listings_update_policy" ON listings
  FOR UPDATE TO authenticated
  USING (auth.uid() = seller_id);

-- Order policies
CREATE POLICY "orders_select_policy" ON orders
  FOR SELECT TO authenticated
  USING (
    buyer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = orders.listing_id
      AND listings.seller_id = auth.uid()
    )
  );

CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders_update_policy" ON orders
  FOR UPDATE TO authenticated
  USING (
    buyer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = orders.listing_id
      AND listings.seller_id = auth.uid()
    )
  );

-- Dispute policies
CREATE POLICY "disputes_select_policy" ON disputes
  FOR SELECT TO authenticated
  USING (
    initiator_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = disputes.order_id
      AND (
        orders.buyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM listings
          WHERE listings.id = orders.listing_id
          AND listings.seller_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "disputes_insert_policy" ON disputes
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = initiator_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.buyer_id = auth.uid()
    )
  );

CREATE POLICY "disputes_update_policy" ON disputes
  FOR UPDATE TO authenticated
  USING (
    initiator_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = disputes.order_id
      AND (
        orders.buyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM listings
          WHERE listings.id = orders.listing_id
          AND listings.seller_id = auth.uid()
        )
      )
    )
  );

-- Dispute message policies
CREATE POLICY "dispute_messages_select_policy" ON dispute_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM disputes
      WHERE disputes.id = dispute_id
      AND (
        disputes.initiator_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = disputes.order_id
          AND (
            orders.buyer_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM listings
              WHERE listings.id = orders.listing_id
              AND listings.seller_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "dispute_messages_insert_policy" ON dispute_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM disputes
      WHERE disputes.id = dispute_id
      AND (
        disputes.initiator_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = disputes.order_id
          AND (
            orders.buyer_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM listings
              WHERE listings.id = orders.listing_id
              AND listings.seller_id = auth.uid()
            )
          )
        )
      )
    )
  );

-- Dispute evidence policies
CREATE POLICY "dispute_evidence_select_policy" ON dispute_evidence
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM disputes
      WHERE disputes.id = dispute_id
      AND (
        disputes.initiator_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = disputes.order_id
          AND (
            orders.buyer_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM listings
              WHERE listings.id = orders.listing_id
              AND listings.seller_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "dispute_evidence_insert_policy" ON dispute_evidence
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM disputes
      WHERE disputes.id = dispute_id
      AND (
        disputes.initiator_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = disputes.order_id
          AND (
            orders.buyer_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM listings
              WHERE listings.id = orders.listing_id
              AND listings.seller_id = auth.uid()
            )
          )
        )
      )
    )
  );
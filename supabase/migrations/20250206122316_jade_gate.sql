/*
  # Create marketplace and transactions tables

  1. New Tables
    - `book_listings` - Books for sale
      - `id` (uuid) - Primary key
      - `seller_id` (uuid) - References users.id
      - `book_id` (uuid) - References books.id
      - `price` (decimal) - Asking price
      - `condition` (text) - Book condition
      - `description` (text) - Listing description
      - `location` (text) - Seller location
      - `exchange_possible` (boolean) - Whether exchange is possible
      - `status` (text) - Listing status
      - `created_at` (timestamptz) - Listing creation date

    - `transactions` - Purchase transactions
      - `id` (uuid) - Primary key
      - `listing_id` (uuid) - References book_listings.id
      - `buyer_id` (uuid) - References users.id
      - `amount` (decimal) - Transaction amount
      - `status` (text) - Transaction status
      - `shipping_method` (text) - Shipping method
      - `shipping_address` (jsonb) - Shipping details
      - `created_at` (timestamptz) - Transaction date

    - `disputes` - Transaction disputes
      - `id` (uuid) - Primary key
      - `transaction_id` (uuid) - References transactions.id
      - `opened_by` (uuid) - References users.id
      - `reason` (text) - Dispute reason
      - `description` (text) - Dispute details
      - `status` (text) - Dispute status
      - `resolution` (text) - Resolution type
      - `amount` (decimal) - Resolution amount
      - `created_at` (timestamptz) - Opening date

  2. Security
    - Enable RLS on all tables
    - Add policies for marketplace operations
*/

-- Create book listings table
CREATE TABLE book_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  condition text NOT NULL,
  description text,
  location text NOT NULL,
  exchange_possible boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_condition CHECK (
    condition IN ('new', 'like-new', 'very-good', 'good', 'acceptable')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('active', 'sold', 'reserved', 'cancelled')
  )
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES book_listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  shipping_method text NOT NULL,
  shipping_address jsonb,
  tracking_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (
    status IN (
      'pending', 'processing', 'shipped', 
      'delivered', 'completed', 'cancelled', 'refunded'
    )
  ),
  CONSTRAINT valid_shipping_method CHECK (
    shipping_method IN ('mondial_relay', 'colissimo', 'hand_delivery')
  )
);

-- Create disputes table
CREATE TABLE disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  opened_by uuid REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'opened',
  resolution text,
  amount decimal(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT valid_reason CHECK (
    reason IN (
      'item_not_received', 'item_not_as_described',
      'wrong_item', 'damaged_item', 'other'
    )
  ),
  CONSTRAINT valid_status CHECK (
    status IN (
      'opened', 'seller_response', 'mediation',
      'resolved', 'cancelled'
    )
  ),
  CONSTRAINT valid_resolution CHECK (
    resolution IS NULL OR
    resolution IN (
      'full_refund', 'partial_refund',
      'return_item', 'keep_item', 'cancelled'
    )
  ),
  CONSTRAINT valid_amount CHECK (
    (resolution IN ('full_refund', 'partial_refund') AND amount IS NOT NULL) OR
    (resolution NOT IN ('full_refund', 'partial_refund') AND amount IS NULL)
  )
);

-- Create dispute messages table
CREATE TABLE dispute_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id uuid REFERENCES disputes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_from_support boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE book_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;

-- Policies for book_listings
CREATE POLICY "Anyone can view active listings"
  ON book_listings FOR SELECT
  USING (
    status = 'active' OR
    seller_id = auth.uid() OR
    id IN (
      SELECT listing_id FROM transactions WHERE buyer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create listings"
  ON book_listings FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their listings"
  ON book_listings FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Policies for transactions
CREATE POLICY "Users can view their transactions"
  ON transactions FOR SELECT
  USING (
    buyer_id = auth.uid() OR
    listing_id IN (
      SELECT id FROM book_listings WHERE seller_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    buyer_id = auth.uid() AND
    listing_id IN (
      SELECT id FROM book_listings WHERE status = 'active'
    )
  );

-- Policies for disputes
CREATE POLICY "Transaction participants can view disputes"
  ON disputes FOR SELECT
  USING (
    opened_by = auth.uid() OR
    transaction_id IN (
      SELECT t.id FROM transactions t
      JOIN book_listings bl ON bl.id = t.listing_id
      WHERE t.buyer_id = auth.uid() OR bl.seller_id = auth.uid()
    )
  );

CREATE POLICY "Transaction participants can create disputes"
  ON disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    transaction_id IN (
      SELECT t.id FROM transactions t
      JOIN book_listings bl ON bl.id = t.listing_id
      WHERE t.buyer_id = auth.uid() OR bl.seller_id = auth.uid()
    )
  );

-- Policies for dispute_messages
CREATE POLICY "Dispute participants can view messages"
  ON dispute_messages FOR SELECT
  USING (
    dispute_id IN (
      SELECT d.id FROM disputes d
      JOIN transactions t ON t.id = d.transaction_id
      JOIN book_listings bl ON bl.id = t.listing_id
      WHERE d.opened_by = auth.uid() OR
            t.buyer_id = auth.uid() OR
            bl.seller_id = auth.uid()
    )
  );

CREATE POLICY "Dispute participants can create messages"
  ON dispute_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    dispute_id IN (
      SELECT d.id FROM disputes d
      JOIN transactions t ON t.id = d.transaction_id
      JOIN book_listings bl ON bl.id = t.listing_id
      WHERE d.opened_by = auth.uid() OR
            t.buyer_id = auth.uid() OR
            bl.seller_id = auth.uid()
    )
  );

-- Update triggers
CREATE TRIGGER update_book_listings_updated_at
  BEFORE UPDATE ON book_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Functions for marketplace operations
CREATE OR REPLACE FUNCTION purchase_book(
  listing_id_param uuid,
  shipping_method_param text,
  shipping_address_param jsonb
)
RETURNS uuid AS $$
DECLARE
  transaction_id uuid;
BEGIN
  -- Check if listing exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM book_listings
    WHERE id = listing_id_param AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Listing not found or not available';
  END IF;

  -- Create transaction
  INSERT INTO transactions (
    listing_id,
    buyer_id,
    amount,
    shipping_method,
    shipping_address
  )
  SELECT
    id,
    auth.uid(),
    price,
    shipping_method_param,
    shipping_address_param
  FROM book_listings
  WHERE id = listing_id_param
  RETURNING id INTO transaction_id;

  -- Update listing status
  UPDATE book_listings
  SET status = 'reserved'
  WHERE id = listing_id_param;

  RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION open_dispute(
  transaction_id_param uuid,
  reason_param text,
  description_param text
)
RETURNS uuid AS $$
DECLARE
  dispute_id uuid;
BEGIN
  -- Check if transaction exists and user is participant
  IF NOT EXISTS (
    SELECT 1 FROM transactions t
    JOIN book_listings bl ON bl.id = t.listing_id
    WHERE t.id = transaction_id_param
    AND (t.buyer_id = auth.uid() OR bl.seller_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Transaction not found or not authorized';
  END IF;

  -- Check if dispute already exists
  IF EXISTS (
    SELECT 1 FROM disputes
    WHERE transaction_id = transaction_id_param
  ) THEN
    RAISE EXCEPTION 'Dispute already exists for this transaction';
  END IF;

  -- Create dispute
  INSERT INTO disputes (
    transaction_id,
    opened_by,
    reason,
    description
  )
  VALUES (
    transaction_id_param,
    auth.uid(),
    reason_param,
    description_param
  )
  RETURNING id INTO dispute_id;

  RETURN dispute_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
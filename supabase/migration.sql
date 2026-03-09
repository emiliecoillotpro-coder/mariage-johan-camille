-- Table RSVP pour le mariage Johan & Camille
CREATE TABLE rsvp_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  ceremonie_civile BOOLEAN NOT NULL DEFAULT false,
  reception_chateau BOOLEAN NOT NULL DEFAULT false,
  nombre_accompagnants INTEGER NOT NULL DEFAULT 0,
  restrictions_alimentaires TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can INSERT (public RSVP form)
CREATE POLICY "Allow public insert" ON rsvp_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: anyone can SELECT (admin reads via API routes with password protection)
CREATE POLICY "Allow public select" ON rsvp_responses
  FOR SELECT
  TO anon
  USING (true);

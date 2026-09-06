-- Create tables for the digital needs survey
-- Run this migration first, then run 20240906_submit_survey_rpc.sql

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS investment_intention CASCADE;
DROP TABLE IF EXISTS digital_needs CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS digital_tools CASCADE;
DROP TABLE IF EXISTS acquisition_methods CASCADE;
DROP TABLE IF EXISTS participants CASCADE;

-- Participants table
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  city TEXT,
  age_range TEXT,
  main_activity TEXT NOT NULL,
  activity_years INTEGER,
  whatsapp TEXT,
  email TEXT,
  contact_consent BOOLEAN DEFAULT FALSE,
  opportunity_score INTEGER,
  opportunity_level TEXT,
  digital_maturity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Acquisition methods table
CREATE TABLE IF NOT EXISTS acquisition_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital tools table
CREATE TABLE IF NOT EXISTS digital_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital needs table
CREATE TABLE IF NOT EXISTS digital_needs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  need_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment intention table
CREATE TABLE IF NOT EXISTS investment_intention (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  willing_to_invest TEXT NOT NULL,
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_main_activity ON participants(main_activity);
CREATE INDEX IF NOT EXISTS idx_participants_opportunity_level ON participants(opportunity_level);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);
CREATE INDEX IF NOT EXISTS idx_acquisition_methods_participant ON acquisition_methods(participant_id);
CREATE INDEX IF NOT EXISTS idx_digital_tools_participant ON digital_tools(participant_id);
CREATE INDEX IF NOT EXISTS idx_challenges_participant ON challenges(participant_id);
CREATE INDEX IF NOT EXISTS idx_digital_needs_participant ON digital_needs(participant_id);
CREATE INDEX IF NOT EXISTS idx_investment_intention_participant ON investment_intention(participant_id);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE acquisition_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_intention ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access (using service role)
-- Note: The service role key bypasses RLS, so these policies are for anon key access
-- For now, we'll allow read access for authenticated users and write access via the RPC function

CREATE POLICY "Allow read access for authenticated users" ON participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON acquisition_methods
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON digital_tools
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON challenges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON digital_needs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON investment_intention
  FOR SELECT USING (auth.role() = 'authenticated');

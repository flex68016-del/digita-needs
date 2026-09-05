-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Participants table
CREATE TABLE participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Profile info
  name TEXT,
  city TEXT,
  age_range TEXT,
  main_activity TEXT,
  activity_years INTEGER,
  
  -- Contact info (optional)
  whatsapp TEXT,
  email TEXT,
  contact_consent BOOLEAN DEFAULT FALSE,
  
  -- Opportunity score
  opportunity_score INTEGER DEFAULT 0,
  opportunity_level TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
  
  -- Digital maturity level
  digital_maturity INTEGER DEFAULT 0
);

-- Digital tools used (many-to-many)
CREATE TABLE digital_tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges identified
CREATE TABLE challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital needs requested
CREATE TABLE digital_needs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  need_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer acquisition methods
CREATE TABLE acquisition_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment intention
CREATE TABLE investment_intention (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE UNIQUE,
  willing_to_invest TEXT NOT NULL, -- 'yes', 'maybe', 'need_info', 'no'
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE acquisition_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_intention ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Participants: Public can insert, but only read aggregated data (no individual access)
CREATE POLICY "Allow insert for participants" 
  ON participants FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow update own participants" 
  ON participants FOR UPDATE 
  TO anon, authenticated 
  USING (true);

-- Related tables: Public can insert, no read access (admin uses service role)
CREATE POLICY "Allow insert for digital_tools" 
  ON digital_tools FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow insert for challenges" 
  ON challenges FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow insert for digital_needs" 
  ON digital_needs FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow insert for acquisition_methods" 
  ON acquisition_methods FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow insert for investment_intention" 
  ON investment_intention FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_participants_city ON participants(city);
CREATE INDEX idx_participants_activity ON participants(main_activity);
CREATE INDEX idx_participants_score ON participants(opportunity_score);
CREATE INDEX idx_digital_tools_participant ON digital_tools(participant_id);
CREATE INDEX idx_challenges_participant ON challenges(participant_id);
CREATE INDEX idx_digital_needs_participant ON digital_needs(participant_id);
CREATE INDEX idx_acquisition_methods_participant ON acquisition_methods(participant_id);
CREATE INDEX idx_investment_intention_participant ON investment_intention(participant_id);

-- Function to calculate opportunity score
CREATE OR REPLACE FUNCTION calculate_opportunity_score(participant_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  challenge_count INTEGER;
  need_count INTEGER;
  tool_count INTEGER;
  budget_score INTEGER := 0;
  intention_score INTEGER := 0;
  investment_record RECORD;
BEGIN
  -- Count challenges identified
  SELECT COUNT(*) INTO challenge_count 
  FROM challenges 
  WHERE participant_id = participant_id;
  
  -- Count digital needs
  SELECT COUNT(*) INTO need_count 
  FROM digital_needs 
  WHERE participant_id = participant_id;
  
  -- Count digital tools (lower digital maturity = higher opportunity)
  SELECT COUNT(*) INTO tool_count 
  FROM digital_tools 
  WHERE participant_id = participant_id;
  
  -- Get investment intention
  SELECT * INTO investment_record
  FROM investment_intention
  WHERE participant_id = participant_id;
  
  -- Calculate base score from challenges and needs
  score := score + (challenge_count * 10);
  score := score + (need_count * 15);
  
  -- Digital maturity factor (fewer tools = higher opportunity)
  IF tool_count <= 2 THEN
    score := score + 20;
  ELSIF tool_count <= 5 THEN
    score := score + 10;
  END IF;
  
  -- Budget score
  IF investment_record.budget_range = '50000-100000' THEN
    budget_score := 15;
  ELSIF investment_record.budget_range = '100000-250000' THEN
    budget_score := 25;
  ELSIF investment_record.budget_range = '250000-500000' THEN
    budget_score := 35;
  ELSIF investment_record.budget_range = '+500000' THEN
    budget_score := 45;
  ELSIF investment_record.budget_range = '25000-50000' THEN
    budget_score := 10;
  END IF;
  
  score := score + budget_score;
  
  -- Intention score
  IF investment_record.willing_to_invest = 'yes' THEN
    intention_score := 20;
  ELSIF investment_record.willing_to_invest = 'maybe' THEN
    intention_score := 10;
  ELSIF investment_record.willing_to_invest = 'need_info' THEN
    intention_score := 5;
  END IF;
  
  score := score + intention_score;
  
  -- Cap at 100
  IF score > 100 THEN
    score := 100;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to update opportunity level
CREATE OR REPLACE FUNCTION update_opportunity_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.opportunity_score := calculate_opportunity_score(NEW.id);
  
  IF NEW.opportunity_score >= 70 THEN
    NEW.opportunity_level := 'high';
  ELSIF NEW.opportunity_score >= 40 THEN
    NEW.opportunity_level := 'medium';
  ELSE
    NEW.opportunity_level := 'low';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate opportunity score
CREATE TRIGGER trigger_update_opportunity_score
  BEFORE INSERT OR UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_opportunity_level();

-- Function to calculate digital maturity
CREATE OR REPLACE FUNCTION calculate_digital_maturity(participant_id UUID)
RETURNS INTEGER AS $$
DECLARE
  tool_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tool_count 
  FROM digital_tools 
  WHERE participant_id = participant_id;
  
  -- Simple maturity score based on tool count
  RETURN tool_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update digital maturity
CREATE TRIGGER trigger_update_digital_maturity
  BEFORE INSERT OR UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION calculate_digital_maturity(NEW.id);
-- ============================================================
-- digita-needs — schéma Supabase (état de référence, idempotent)
-- Peut être rejoué sans danger sur une base déjà à jour ou une base neuve.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ TABLES ============

CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  city TEXT,
  age_range TEXT,
  main_activity TEXT NOT NULL,
  activity_years TEXT,
  whatsapp TEXT,
  email TEXT,
  contact_consent BOOLEAN DEFAULT FALSE,
  opportunity_score INTEGER DEFAULT 0,
  opportunity_level TEXT DEFAULT 'low' CHECK (opportunity_level IN ('low', 'medium', 'high')),
  digital_maturity INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS digital_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digital_needs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  need_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS acquisition_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investment_intention (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL UNIQUE REFERENCES participants(id) ON DELETE CASCADE,
  willing_to_invest TEXT NOT NULL CHECK (willing_to_invest IN ('oui', 'peut_etre', 'besoin_info', 'non')),
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_participants_city ON participants(city);
CREATE INDEX IF NOT EXISTS idx_participants_main_activity ON participants(main_activity);
CREATE INDEX IF NOT EXISTS idx_participants_opportunity_level ON participants(opportunity_level);
CREATE INDEX IF NOT EXISTS idx_participants_opportunity_score ON participants(opportunity_score);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);
CREATE INDEX IF NOT EXISTS idx_digital_tools_participant ON digital_tools(participant_id);
CREATE INDEX IF NOT EXISTS idx_challenges_participant ON challenges(participant_id);
CREATE INDEX IF NOT EXISTS idx_digital_needs_participant ON digital_needs(participant_id);
CREATE INDEX IF NOT EXISTS idx_acquisition_methods_participant ON acquisition_methods(participant_id);
CREATE INDEX IF NOT EXISTS idx_investment_intention_participant ON investment_intention(participant_id);

-- ============ ROW LEVEL SECURITY ============
-- Deny-all pour anon/authenticated : toute écriture passe par les fonctions
-- SECURITY DEFINER ci-dessous. Toute lecture admin passe par le service_role
-- côté serveur (route /api/admin/stats), qui contourne la RLS.

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE acquisition_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_intention ENABLE ROW LEVEL SECURITY;

-- ============ FONCTIONS DE SCORING ============

CREATE OR REPLACE FUNCTION calculate_digital_maturity(p_participant_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  tool_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tool_count FROM digital_tools WHERE participant_id = p_participant_id;
  RETURN tool_count;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_opportunity_score(p_participant_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  score INTEGER := 0;
  challenge_count INTEGER;
  need_count INTEGER;
  tool_count INTEGER;
  budget_score INTEGER := 0;
  intention_score INTEGER := 0;
  investment_record RECORD;
BEGIN
  SELECT COUNT(*) INTO challenge_count FROM challenges WHERE participant_id = p_participant_id;
  SELECT COUNT(*) INTO need_count FROM digital_needs WHERE participant_id = p_participant_id;
  SELECT COUNT(*) INTO tool_count FROM digital_tools WHERE participant_id = p_participant_id;
  SELECT * INTO investment_record FROM investment_intention WHERE participant_id = p_participant_id;

  score := score + (challenge_count * 10);
  score := score + (need_count * 15);

  IF tool_count <= 2 THEN
    score := score + 20;
  ELSIF tool_count <= 5 THEN
    score := score + 10;
  END IF;

  IF investment_record.budget_range = '50k_100k' THEN
    budget_score := 15;
  ELSIF investment_record.budget_range = '100k_250k' THEN
    budget_score := 25;
  ELSIF investment_record.budget_range = '250k_500k' THEN
    budget_score := 35;
  ELSIF investment_record.budget_range = 'gt_500k' THEN
    budget_score := 45;
  ELSIF investment_record.budget_range = '25k_50k' THEN
    budget_score := 10;
  END IF;

  score := score + budget_score;

  IF investment_record.willing_to_invest = 'oui' THEN
    intention_score := 20;
  ELSIF investment_record.willing_to_invest = 'peut_etre' THEN
    intention_score := 10;
  ELSIF investment_record.willing_to_invest = 'besoin_info' THEN
    intention_score := 5;
  END IF;

  score := score + intention_score;

  IF score > 100 THEN
    score := 100;
  END IF;

  RETURN score;
END;
$$;

-- ============ RPC : SOUMISSION DU SONDAGE ============

DROP FUNCTION IF EXISTS submit_survey(TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT);
DROP FUNCTION IF EXISTS submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT);

CREATE OR REPLACE FUNCTION submit_survey(
  p_name TEXT,
  p_city TEXT,
  p_age_range TEXT,
  p_main_activity TEXT,
  p_activity_years TEXT,
  p_whatsapp TEXT,
  p_email TEXT,
  p_contact_consent BOOLEAN,
  p_acquisition_methods TEXT[],
  p_digital_tools TEXT[],
  p_challenges TEXT[],
  p_digital_needs TEXT[],
  p_willing_to_invest TEXT,
  p_budget_range TEXT
)
RETURNS TABLE(participant_id UUID, opportunity_score INTEGER, opportunity_level TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_item TEXT;
  v_score INTEGER;
  v_level TEXT;
  v_maturity INTEGER;
BEGIN
  INSERT INTO participants (name, city, age_range, main_activity, activity_years, whatsapp, email, contact_consent)
  VALUES (NULLIF(p_name, ''), NULLIF(p_city, ''), p_age_range, p_main_activity, p_activity_years, NULLIF(p_whatsapp, ''), NULLIF(p_email, ''), COALESCE(p_contact_consent, FALSE))
  RETURNING id INTO v_id;

  IF p_acquisition_methods IS NOT NULL THEN
    FOREACH v_item IN ARRAY p_acquisition_methods LOOP
      INSERT INTO acquisition_methods (participant_id, method_name) VALUES (v_id, v_item);
    END LOOP;
  END IF;

  IF p_digital_tools IS NOT NULL THEN
    FOREACH v_item IN ARRAY p_digital_tools LOOP
      INSERT INTO digital_tools (participant_id, tool_name) VALUES (v_id, v_item);
    END LOOP;
  END IF;

  IF p_challenges IS NOT NULL THEN
    FOREACH v_item IN ARRAY p_challenges LOOP
      INSERT INTO challenges (participant_id, challenge_name) VALUES (v_id, v_item);
    END LOOP;
  END IF;

  IF p_digital_needs IS NOT NULL THEN
    FOREACH v_item IN ARRAY p_digital_needs LOOP
      INSERT INTO digital_needs (participant_id, need_name) VALUES (v_id, v_item);
    END LOOP;
  END IF;

  IF p_willing_to_invest IS NOT NULL THEN
    INSERT INTO investment_intention (participant_id, willing_to_invest, budget_range)
    VALUES (v_id, p_willing_to_invest, p_budget_range);
  END IF;

  v_maturity := calculate_digital_maturity(v_id);
  v_score := calculate_opportunity_score(v_id);
  v_level := CASE WHEN v_score >= 70 THEN 'high' WHEN v_score >= 40 THEN 'medium' ELSE 'low' END;

  UPDATE participants
  SET digital_maturity = v_maturity,
      opportunity_score = v_score,
      opportunity_level = v_level,
      updated_at = NOW()
  WHERE id = v_id;

  RETURN QUERY SELECT v_id, v_score, v_level;
END;
$$;

REVOKE ALL ON FUNCTION submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT) TO anon, authenticated;

-- ============ RPC : MISE À JOUR DES COORDONNÉES (opt-in différé) ============

CREATE OR REPLACE FUNCTION update_contact_info(
  p_participant_id UUID,
  p_name TEXT,
  p_whatsapp TEXT,
  p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE participants
  SET name = NULLIF(p_name, ''),
      whatsapp = NULLIF(p_whatsapp, ''),
      email = NULLIF(p_email, ''),
      contact_consent = TRUE,
      updated_at = NOW()
  WHERE id = p_participant_id;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION update_contact_info(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_contact_info(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;

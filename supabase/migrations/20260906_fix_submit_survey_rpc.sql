-- Fix submit_survey RPC to ensure it properly stores name, whatsapp, and email
DROP FUNCTION IF EXISTS submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT);

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
  -- Insert participant with all fields including name, whatsapp, email
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

  INSERT INTO investment_intention (participant_id, willing_to_invest, budget_range)
  VALUES (v_id, p_willing_to_invest, p_budget_range);

  -- Calculate digital maturity
  SELECT COUNT(*) INTO v_maturity
  FROM digital_tools
  WHERE participant_id = v_id;

  UPDATE participants SET digital_maturity = v_maturity WHERE id = v_id;

  -- Calculate opportunity score
  v_score := calculate_opportunity_score(v_id);

  -- Determine opportunity level
  IF v_score >= 70 THEN
    v_level := 'high';
  ELSIF v_score >= 40 THEN
    v_level := 'medium';
  ELSE
    v_level := 'low';
  END IF;

  UPDATE participants SET opportunity_score = v_score, opportunity_level = v_level WHERE id = v_id;

  RETURN QUERY SELECT v_id, v_score, v_level;
END;
$$;

REVOKE ALL ON FUNCTION submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION submit_survey(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT) TO anon, authenticated;

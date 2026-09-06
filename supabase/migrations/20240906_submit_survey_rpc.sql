-- Create submit_survey RPC function
-- This function handles survey submission and stores data in multiple tables

CREATE OR REPLACE FUNCTION submit_survey(
  p_main_activity TEXT,
  p_willing_to_invest TEXT,
  p_name TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_age_range TEXT DEFAULT NULL,
  p_activity_years INTEGER DEFAULT NULL,
  p_whatsapp TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_contact_consent BOOLEAN DEFAULT FALSE,
  p_acquisition_methods TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_digital_tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_challenges TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_digital_needs TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_budget_range TEXT DEFAULT NULL
)
RETURNS TABLE (
  participant_id UUID,
  opportunity_score INTEGER,
  opportunity_level TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_participant_id UUID;
  v_opportunity_score INTEGER;
  v_opportunity_level TEXT;
  v_digital_maturity INTEGER;
BEGIN
  -- Calculate digital maturity based on digital tools count
  v_digital_maturity := LEAST(10, GREATEST(0, array_length(p_digital_tools, 1) * 2));
  
  -- Calculate opportunity score based on responses
  -- High score if willing to invest AND has digital needs
  v_opportunity_score := 
    CASE 
      WHEN p_willing_to_invest = 'oui' AND array_length(p_digital_needs, 1) > 0 THEN 80
      WHEN p_willing_to_invest = 'oui' THEN 60
      WHEN p_willing_to_invest = 'peut_etre' AND array_length(p_digital_needs, 1) > 0 THEN 50
      WHEN p_willing_to_invest = 'peut_etre' THEN 30
      WHEN p_willing_to_invest = 'besoin_info' AND array_length(p_digital_needs, 1) > 0 THEN 40
      ELSE 20
    END;
  
  -- Determine opportunity level
  v_opportunity_level := 
    CASE 
      WHEN v_opportunity_score >= 70 THEN 'high'
      WHEN v_opportunity_score >= 40 THEN 'medium'
      ELSE 'low'
    END;
  
  -- Insert participant
  INSERT INTO participants (
    name,
    city,
    age_range,
    main_activity,
    activity_years,
    whatsapp,
    email,
    contact_consent,
    opportunity_score,
    opportunity_level,
    digital_maturity,
    created_at
  ) VALUES (
    p_name,
    p_city,
    p_age_range,
    p_main_activity,
    p_activity_years,
    p_whatsapp,
    p_email,
    p_contact_consent,
    v_opportunity_score,
    v_opportunity_level,
    v_digital_maturity,
    NOW()
  )
  RETURNING id INTO v_participant_id;
  
  -- Insert acquisition methods
  IF array_length(p_acquisition_methods, 1) > 0 THEN
    INSERT INTO acquisition_methods (participant_id, method_name)
    SELECT v_participant_id, unnest(p_acquisition_methods);
  END IF;
  
  -- Insert digital tools
  IF array_length(p_digital_tools, 1) > 0 THEN
    INSERT INTO digital_tools (participant_id, tool_name)
    SELECT v_participant_id, unnest(p_digital_tools);
  END IF;
  
  -- Insert challenges
  IF array_length(p_challenges, 1) > 0 THEN
    INSERT INTO challenges (participant_id, challenge_name)
    SELECT v_participant_id, unnest(p_challenges);
  END IF;
  
  -- Insert digital needs
  IF array_length(p_digital_needs, 1) > 0 THEN
    INSERT INTO digital_needs (participant_id, need_name)
    SELECT v_participant_id, unnest(p_digital_needs);
  END IF;
  
  -- Insert investment intention
  INSERT INTO investment_intention (
    participant_id,
    willing_to_invest,
    budget_range
  ) VALUES (
    v_participant_id,
    p_willing_to_invest,
    p_budget_range
  );
  
  -- Return results
  RETURN QUERY SELECT 
    v_participant_id,
    v_opportunity_score,
    v_opportunity_level;
END;
$$;

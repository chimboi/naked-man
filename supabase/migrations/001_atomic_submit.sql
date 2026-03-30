-- ============================================================
-- Atomic answer submission
-- Uses FOR UPDATE to lock the row, preventing race conditions
-- where two players writing simultaneously overwrite each other.
-- ============================================================
CREATE OR REPLACE FUNCTION submit_answer(
  p_session_id text,
  p_player_id text,
  p_answer text
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  current_state jsonb;
  current_answers jsonb;
BEGIN
  -- Lock the row to serialize concurrent writes
  SELECT state INTO current_state
  FROM game_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF current_state IS NULL THEN
    RETURN NULL;
  END IF;

  -- Only accept answers during question phase
  IF current_state->>'phase' != 'question' THEN
    RETURN current_state;
  END IF;

  -- Don't overwrite an existing answer from this player
  IF current_state->'answers' ? p_player_id THEN
    RETURN current_state;
  END IF;

  -- Atomically add the answer
  current_answers := COALESCE(current_state->'answers', '{}'::jsonb);
  current_answers := current_answers || jsonb_build_object(p_player_id, p_answer);
  current_state := jsonb_set(current_state, '{answers}', current_answers);

  UPDATE game_sessions SET state = current_state WHERE id = p_session_id;

  RETURN current_state;
END;
$$;

-- ============================================================
-- Atomic guess submission
-- Same locking pattern as submit_answer.
-- ============================================================
CREATE OR REPLACE FUNCTION submit_guess(
  p_session_id text,
  p_player_id text,
  p_guessed_id text
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  current_state jsonb;
  current_guesses jsonb;
BEGIN
  SELECT state INTO current_state
  FROM game_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF current_state IS NULL THEN
    RETURN NULL;
  END IF;

  -- Only accept guesses during guess phase
  IF current_state->>'phase' != 'guess' THEN
    RETURN current_state;
  END IF;

  -- Don't overwrite an existing guess from this player
  IF current_state->'guesses' ? p_player_id THEN
    RETURN current_state;
  END IF;

  -- Atomically add the guess
  current_guesses := COALESCE(current_state->'guesses', '{}'::jsonb);
  current_guesses := current_guesses || jsonb_build_object(p_player_id, p_guessed_id);
  current_state := jsonb_set(current_state, '{guesses}', current_guesses);

  UPDATE game_sessions SET state = current_state WHERE id = p_session_id;

  RETURN current_state;
END;
$$;

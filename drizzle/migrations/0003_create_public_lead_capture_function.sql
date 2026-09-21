CREATE OR REPLACE FUNCTION public.create_qg_lead(
  p_nome text,
  p_whatsapp text,
  p_email text,
  p_time text,
  p_progress_token uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF char_length(trim(p_nome)) NOT BETWEEN 1 AND 80
    OR char_length(p_whatsapp) NOT BETWEEN 10 AND 20
    OR char_length(trim(p_email)) NOT BETWEEN 5 AND 254
    OR char_length(trim(p_time)) NOT BETWEEN 1 AND 80
    OR p_progress_token IS NULL THEN
    RAISE EXCEPTION 'Invalid lead data';
  END IF;

  INSERT INTO public.leads (nome, whatsapp, email, time, progress_token)
  VALUES (trim(p_nome), p_whatsapp, trim(p_email), trim(p_time), p_progress_token)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_qg_lead(text, text, text, text, uuid) TO anon, authenticated;
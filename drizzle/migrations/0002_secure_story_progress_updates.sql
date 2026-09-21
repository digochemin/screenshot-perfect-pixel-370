ALTER TABLE public.leads
  ADD COLUMN progress_token uuid;

CREATE UNIQUE INDEX leads_progress_token_idx ON public.leads (progress_token) WHERE progress_token IS NOT NULL;

CREATE OR REPLACE FUNCTION public.update_lead_story_progress(
  p_lead_id uuid,
  p_progress_token uuid,
  p_tela_maxima integer,
  p_acertos jsonb,
  p_ticket_escolhido integer,
  p_concluiu boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.leads
  SET tela_maxima = GREATEST(tela_maxima, LEAST(GREATEST(p_tela_maxima, 0), 31)),
      acertos = COALESCE(p_acertos, '{}'::jsonb),
      ticket_escolhido = p_ticket_escolhido,
      concluiu = concluiu OR COALESCE(p_concluiu, false)
  WHERE id = p_lead_id AND progress_token = p_progress_token;
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_lead_story_progress(uuid, uuid, integer, jsonb, integer, boolean) TO anon, authenticated;

ALTER TABLE public.leads ALTER COLUMN situacao_pagina SET DEFAULT '';
ALTER TABLE public.leads ALTER COLUMN nicho_resultado SET DEFAULT '';
COMMENT ON COLUMN public.leads.progress_token IS 'Unpredictable token used to authorize anonymous story progress updates';
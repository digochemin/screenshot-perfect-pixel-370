ALTER TABLE public.leads
  ADD COLUMN data_cadastro timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN tela_maxima integer NOT NULL DEFAULT 0,
  ADD COLUMN acertos jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN ticket_escolhido integer,
  ADD COLUMN concluiu boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.leads.situacao_pagina IS 'DEPRECATED: no longer collected by the educational stories flow';
COMMENT ON COLUMN public.leads.nicho_resultado IS 'DEPRECATED: no longer collected by the educational stories flow';
COMMENT ON COLUMN public.leads.placar_usuario IS 'DEPRECATED: score mechanics were removed';
COMMENT ON COLUMN public.leads.placar_algoritmo IS 'DEPRECATED: score mechanics were removed';
COMMENT ON COLUMN public.leads.semana_montada IS 'DEPRECATED: interactive week builder was removed';
COMMENT ON COLUMN public.leads.valores_simulador IS 'DEPRECATED: slider simulator was removed';
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  time text NOT NULL,
  situacao_pagina text NOT NULL,
  nicho_resultado text NOT NULL,
  placar_usuario integer NOT NULL DEFAULT 0,
  placar_algoritmo integer NOT NULL DEFAULT 0,
  semana_montada jsonb NOT NULL DEFAULT '{}'::jsonb,
  valores_simulador jsonb NOT NULL DEFAULT '{}'::jsonb,
  data_criacao timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT TO anon WITH CHECK (char_length(nome) BETWEEN 1 AND 80 AND char_length(email) BETWEEN 5 AND 254 AND char_length(whatsapp) BETWEEN 10 AND 20);
CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT TO authenticated USING (true);
-- Criar tabela para insights granulares de anúncios
CREATE TABLE public.ad_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  ad_id TEXT NOT NULL,
  ad_name TEXT,
  date DATE NOT NULL,
  
  -- Demografia
  age_range TEXT,
  gender TEXT,
  country TEXT,
  region TEXT,
  
  -- Dispositivos e Plataformas
  device_type TEXT,
  publisher_platform TEXT,
  placement TEXT,
  
  -- Tempo
  hour_of_day INTEGER,
  day_of_week INTEGER,
  
  -- Métricas principais
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_value NUMERIC DEFAULT 0,
  
  -- KPIs calculados
  ctr NUMERIC DEFAULT 0,
  cpc NUMERIC DEFAULT 0,
  cpa NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(campaign_id, ad_id, date, age_range, gender, device_type, placement, hour_of_day)
);

-- Habilitar RLS
ALTER TABLE public.ad_insights ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own ad insights"
  ON public.ad_insights
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ad insights"
  ON public.ad_insights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ad insights"
  ON public.ad_insights
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ad insights"
  ON public.ad_insights
  FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_ad_insights_campaign ON public.ad_insights(campaign_id);
CREATE INDEX idx_ad_insights_date ON public.ad_insights(date);
CREATE INDEX idx_ad_insights_user ON public.ad_insights(user_id);
CREATE INDEX idx_ad_insights_demographics ON public.ad_insights(age_range, gender);
CREATE INDEX idx_ad_insights_device ON public.ad_insights(device_type, publisher_platform);
CREATE INDEX idx_ad_insights_hour ON public.ad_insights(hour_of_day);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_ad_insights_updated_at
  BEFORE UPDATE ON public.ad_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários
COMMENT ON TABLE public.ad_insights IS 'Armazena dados granulares de performance de anúncios (demografia, dispositivos, horários)';
COMMENT ON COLUMN public.ad_insights.age_range IS 'Faixa etária: 18-24, 25-34, 35-44, 45-54, 55-64, 65+';
COMMENT ON COLUMN public.ad_insights.gender IS 'Gênero: male, female, unknown';
COMMENT ON COLUMN public.ad_insights.device_type IS 'Tipo de dispositivo: mobile, desktop, tablet';
COMMENT ON COLUMN public.ad_insights.publisher_platform IS 'Plataforma: facebook, instagram, messenger, audience_network';
COMMENT ON COLUMN public.ad_insights.placement IS 'Posicionamento: feed, stories, reels, right_column, etc';
COMMENT ON COLUMN public.ad_insights.hour_of_day IS 'Hora do dia (0-23)';
COMMENT ON COLUMN public.ad_insights.day_of_week IS 'Dia da semana (0-6, sendo 0=domingo)';
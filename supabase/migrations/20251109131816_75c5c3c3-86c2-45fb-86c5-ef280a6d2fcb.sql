-- Tabela de Briefings de Clientes
CREATE TABLE public.client_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  business_segment TEXT NOT NULL,
  business_description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  main_competitors TEXT,
  main_objective TEXT NOT NULL,
  secondary_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  current_channels TEXT[] DEFAULT ARRAY[]::TEXT[],
  monthly_budget NUMERIC,
  website_url TEXT,
  social_media_links JSONB DEFAULT '{}'::JSONB,
  products_services TEXT NOT NULL,
  unique_selling_points TEXT,
  pain_points TEXT,
  success_metrics TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de Planejamentos Estratégicos
CREATE TABLE public.strategic_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  briefing_id UUID,
  
  -- Análise SWOT
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
  opportunities TEXT[] DEFAULT ARRAY[]::TEXT[],
  threats TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Personas
  personas JSONB DEFAULT '[]'::JSONB,
  
  -- Funil de Marketing
  funnel_stages JSONB DEFAULT '{}'::JSONB,
  
  -- Estratégia de Canais
  channel_strategy JSONB DEFAULT '{}'::JSONB,
  
  -- KPIs e Metas
  kpis JSONB DEFAULT '[]'::JSONB,
  
  -- Timeline
  timeline JSONB DEFAULT '[]'::JSONB,
  
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.client_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies para client_briefings
CREATE POLICY "Users can view their own briefings"
  ON public.client_briefings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own briefings"
  ON public.client_briefings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own briefings"
  ON public.client_briefings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own briefings"
  ON public.client_briefings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies para strategic_plans
CREATE POLICY "Users can view their own strategic plans"
  ON public.strategic_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own strategic plans"
  ON public.strategic_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategic plans"
  ON public.strategic_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategic plans"
  ON public.strategic_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_client_briefings_updated_at
  BEFORE UPDATE ON public.client_briefings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategic_plans_updated_at
  BEFORE UPDATE ON public.strategic_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
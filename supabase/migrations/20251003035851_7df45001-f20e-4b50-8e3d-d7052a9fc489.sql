-- Tornar user_id nullable e adicionar client_id
ALTER TABLE public.integrations
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.integrations
ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE;

-- Atualizar RLS policies
DROP POLICY IF EXISTS "Users can view their own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can create their own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can update their own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can delete their own integrations" ON public.integrations;

CREATE POLICY "Users can view integrations of their clients"
ON public.integrations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = integrations.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create integrations for their clients"
ON public.integrations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = integrations.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update integrations of their clients"
ON public.integrations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = integrations.client_id
    AND clients.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete integrations of their clients"
ON public.integrations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = integrations.client_id
    AND clients.user_id = auth.uid()
  )
);
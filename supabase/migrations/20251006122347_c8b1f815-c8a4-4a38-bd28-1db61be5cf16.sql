-- Fase 2: Sistema de Sincronização Automática - Cronjobs

-- Habilitar extensões necessárias para cronjobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar cronjob para sincronização diária de todas as integrações
-- Executa todos os dias às 3:00 AM (horário do servidor)
SELECT cron.schedule(
  'sync-all-integrations-daily',
  '0 3 * * *', -- Todo dia às 3:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka2Rjd2ZtZXZ5dnp4anZteGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzY1ODksImV4cCI6MjA3NDIxMjU4OX0.14AWclcjZAukMlKSCkf934P_gxIMBzjEM6vQF1BwUsE"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Adicionar constraint única para evitar métricas duplicadas (campanha + data)
CREATE UNIQUE INDEX IF NOT EXISTS idx_campaign_metrics_unique 
ON campaign_metrics(campaign_id, date);

-- Adicionar comentários para documentação
COMMENT ON EXTENSION pg_cron IS 'Extensão para agendamento de tarefas (cronjobs)';
COMMENT ON EXTENSION pg_net IS 'Extensão para chamadas HTTP assíncronas';

-- Verificar cronjobs ativos (para debug)
-- SELECT * FROM cron.job;
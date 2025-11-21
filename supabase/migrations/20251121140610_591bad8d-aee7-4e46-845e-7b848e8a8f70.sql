-- Create enum for meeting confirmation status
CREATE TYPE meeting_confirmation_status AS ENUM (
  'pending',
  'confirmed',
  'declined',
  'rescheduled'
);

-- Add confirmation fields to meetings table
ALTER TABLE meetings 
ADD COLUMN client_confirmation_status meeting_confirmation_status DEFAULT 'pending',
ADD COLUMN client_confirmed_at timestamp with time zone,
ADD COLUMN client_suggested_dates jsonb DEFAULT '[]'::jsonb,
ADD COLUMN client_notes text;

-- Create index for pending meetings
CREATE INDEX idx_meetings_confirmation_status 
ON meetings(client_confirmation_status) 
WHERE client_confirmation_status = 'pending';

-- Add comment for documentation
COMMENT ON COLUMN meetings.client_confirmation_status IS 'Status da confirmação do cliente';
COMMENT ON COLUMN meetings.client_confirmed_at IS 'Data/hora em que o cliente respondeu';
COMMENT ON COLUMN meetings.client_suggested_dates IS 'Array JSON com sugestões de horários do cliente';
COMMENT ON COLUMN meetings.client_notes IS 'Observações do cliente sobre a reunião';
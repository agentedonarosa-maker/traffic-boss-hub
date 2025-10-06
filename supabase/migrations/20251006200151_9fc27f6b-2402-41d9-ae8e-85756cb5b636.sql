-- ============================================
-- SECURITY FIX: Notification System Hardening
-- ============================================

-- Create security definer function to validate and create notifications
CREATE OR REPLACE FUNCTION public.create_notification_secure(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_notification_id UUID;
  valid_types TEXT[] := ARRAY['info', 'success', 'warning', 'error', 'sync'];
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;
  
  -- Validate notification type
  IF NOT (p_type = ANY(valid_types)) THEN
    RAISE EXCEPTION 'Invalid notification type. Must be one of: %', valid_types;
  END IF;
  
  -- Validate input lengths
  IF LENGTH(p_title) > 200 THEN
    RAISE EXCEPTION 'Title exceeds maximum length of 200 characters';
  END IF;
  
  IF LENGTH(p_message) > 1000 THEN
    RAISE EXCEPTION 'Message exceeds maximum length of 1000 characters';
  END IF;
  
  -- Insert notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (p_user_id, p_title, p_message, p_type)
  RETURNING id INTO new_notification_id;
  
  RETURN new_notification_id;
END;
$$;

-- Drop the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Create more restrictive policy for system notifications
CREATE POLICY "System can create validated notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  -- Only allow inserts through authenticated users for their own data
  auth.uid() = user_id OR
  -- Allow service role (for system notifications via edge functions)
  auth.role() = 'service_role'
);

-- ============================================
-- SECURITY FIX: Enforce Vault for Integration Credentials
-- ============================================

-- Update the existing trigger to be more strict
DROP TRIGGER IF EXISTS prevent_plaintext_credentials_trigger ON public.integrations;

CREATE OR REPLACE FUNCTION public.enforce_vault_credentials()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cred_keys_count INTEGER;
BEGIN
  -- Count keys in credentials jsonb
  IF NEW.credentials IS NOT NULL AND jsonb_typeof(NEW.credentials) = 'object' THEN
    SELECT count(*) INTO cred_keys_count FROM jsonb_object_keys(NEW.credentials);
    
    -- If vault_secret_name is NULL but credentials has data, block the insert/update
    IF NEW.vault_secret_name IS NULL AND cred_keys_count > 0 THEN
      RAISE EXCEPTION 'Security violation: Credentials must be stored in Vault. Use vault_secret_name instead of plaintext credentials.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_vault_credentials_trigger
  BEFORE INSERT OR UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_vault_credentials();

-- ============================================
-- SECURITY FIX: Add audit columns to notifications
-- ============================================

-- Add source tracking for notifications (optional but recommended)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'system';

-- Add index for better performance on notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON public.notifications(user_id, read, created_at DESC);

-- ============================================
-- Grant necessary permissions
-- ============================================

-- Grant execute permission on the notification function to service role
GRANT EXECUTE ON FUNCTION public.create_notification_secure TO service_role;
GRANT EXECUTE ON FUNCTION public.create_notification_secure TO authenticated;
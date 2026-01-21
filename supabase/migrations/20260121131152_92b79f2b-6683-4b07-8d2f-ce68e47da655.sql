-- Create SOS alerts table to log all SOS activations
CREATE TABLE public.sos_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for sos_alerts
CREATE POLICY "Users can view their own SOS alerts"
ON public.sos_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SOS alerts"
ON public.sos_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOS alerts"
ON public.sos_alerts FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for quick lookups
CREATE INDEX idx_sos_alerts_user_id ON public.sos_alerts(user_id);
CREATE INDEX idx_sos_alerts_status ON public.sos_alerts(status);
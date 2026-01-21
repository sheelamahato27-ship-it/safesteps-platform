-- Create trusted_drivers table
CREATE TABLE public.trusted_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  vehicle_number TEXT,
  vehicle_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trusted_drivers ENABLE ROW LEVEL SECURITY;

-- RLS policies for trusted_drivers
CREATE POLICY "Users can view their own trusted drivers"
ON public.trusted_drivers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trusted drivers"
ON public.trusted_drivers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trusted drivers"
ON public.trusted_drivers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trusted drivers"
ON public.trusted_drivers FOR DELETE
USING (auth.uid() = user_id);

-- Create safety_preferences table
CREATE TABLE public.safety_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  share_location_with_contacts BOOLEAN DEFAULT true,
  auto_sos_enabled BOOLEAN DEFAULT false,
  sos_delay_seconds INTEGER DEFAULT 10,
  preferred_route_type TEXT DEFAULT 'safest',
  night_mode_enabled BOOLEAN DEFAULT true,
  crowd_alerts_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.safety_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for safety_preferences
CREATE POLICY "Users can view their own safety preferences"
ON public.safety_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own safety preferences"
ON public.safety_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety preferences"
ON public.safety_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_trusted_drivers_updated_at
BEFORE UPDATE ON public.trusted_drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_preferences_updated_at
BEFORE UPDATE ON public.safety_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
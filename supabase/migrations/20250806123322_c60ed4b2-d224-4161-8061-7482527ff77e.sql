-- Create yacht charter form submissions table
CREATE TABLE public.yacht_charter_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Charter experience
  has_chartered BOOLEAN,
  
  -- Destination details
  destination_name TEXT,
  destination_region TEXT,
  destination_image TEXT,
  destination_base_price INTEGER,
  destination_countries TEXT[], -- Array of countries
  
  -- Why reasons (multiple selections)
  reasons TEXT[], -- Array of reason IDs like 'adventure', 'romance', etc.
  
  -- Dates and duration
  start_date DATE,
  end_date DATE,
  duration INTEGER, -- Number of days
  
  -- Guests and type
  guests INTEGER,
  guest_types TEXT[], -- Array of guest type IDs
  
  -- Budget
  budget_min INTEGER,
  budget_max INTEGER,
  
  -- Yacht selection
  yacht_id TEXT,
  yacht_name TEXT,
  yacht_type TEXT,
  yacht_image TEXT,
  yacht_price_multiplier DECIMAL(3,2),
  yacht_capacity INTEGER,
  is_bareboat_charter BOOLEAN DEFAULT false,
  
  -- Amenities
  amenities TEXT[], -- Array of selected amenities
  
  -- Contact details
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  contact_methods TEXT[], -- Array like ['email', 'call', 'message']
  preferred_date TEXT,
  preferred_time TEXT,
  appointment_date DATE,
  appointment_time TEXT,
  special_requests TEXT,
  
  -- Form completion status
  consultation_requested BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.yacht_charter_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this is a lead form)
-- Anyone can insert new submissions
CREATE POLICY "Anyone can create yacht charter submissions" 
ON public.yacht_charter_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

-- Only authenticated users (admin/staff) can view submissions
CREATE POLICY "Authenticated users can view yacht charter submissions" 
ON public.yacht_charter_submissions 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users can update submissions
CREATE POLICY "Authenticated users can update yacht charter submissions" 
ON public.yacht_charter_submissions 
FOR UPDATE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_yacht_charter_submissions_updated_at
BEFORE UPDATE ON public.yacht_charter_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_yacht_charter_submissions_email ON public.yacht_charter_submissions(email);
CREATE INDEX idx_yacht_charter_submissions_created_at ON public.yacht_charter_submissions(created_at);
CREATE INDEX idx_yacht_charter_submissions_destination ON public.yacht_charter_submissions(destination_name);
CREATE INDEX idx_yacht_charter_submissions_is_completed ON public.yacht_charter_submissions(is_completed);
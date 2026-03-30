-- Create leads table for Last Call Wedding Co.

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  source text NOT NULL, -- e.g., 'ConciergeChatWidget', 'BudgetSandbox', 'DirectInquiry'
  venue_preference text, -- e.g., 'speakeasy', 'rustic', 'undecided'
  user_preferences jsonb DEFAULT '{}'::jsonb, -- Store dynamic answers here
  status text DEFAULT 'new' NOT NULL -- e.g., 'new', 'contacted', 'qualified', 'closed'
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role to have full access (since we are creating leads server-side)
CREATE POLICY "Service role can manage all leads" 
  ON public.leads 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- (Optional) If you want public to insert without service key (not recommended, but often done for forms if anon key is used server-side):
-- CREATE POLICY "Enable insert for anonymous users" ON public.leads FOR INSERT WITH CHECK (true);

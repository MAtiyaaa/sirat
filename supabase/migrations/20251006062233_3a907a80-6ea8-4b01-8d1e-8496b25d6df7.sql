-- Create user_zakat_data table for storing Zakat calculator inputs
CREATE TABLE public.user_zakat_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency text DEFAULT 'USD',
  nisab_basis text DEFAULT 'gold',
  gold_price_per_gram numeric DEFAULT 0,
  silver_price_per_gram numeric DEFAULT 0,
  cash_bank numeric DEFAULT 0,
  crypto numeric DEFAULT 0,
  gold_grams numeric DEFAULT 0,
  silver_grams numeric DEFAULT 0,
  business_assets numeric DEFAULT 0,
  receivables numeric DEFAULT 0,
  investments numeric DEFAULT 0,
  liabilities numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for user_zakat_data
ALTER TABLE public.user_zakat_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_zakat_data
CREATE POLICY "Users can view their own zakat data"
  ON public.user_zakat_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zakat data"
  ON public.user_zakat_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zakat data"
  ON public.user_zakat_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zakat data"
  ON public.user_zakat_data FOR DELETE
  USING (auth.uid() = user_id);

-- Create user_stats table for tracking usage and streaks
CREATE TABLE public.user_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  times_opened_this_month integer DEFAULT 0,
  times_opened_this_year integer DEFAULT 0,
  days_opened_this_year integer DEFAULT 0,
  last_opened_date date,
  surahs_read integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Add avatar_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Triggers for updated_at columns
CREATE TRIGGER update_user_zakat_data_updated_at
  BEFORE UPDATE ON public.user_zakat_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- AfriGuide Supabase Database Schema
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  role TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'guide', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Zimbabwe',
  location TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  cover_image_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INT DEFAULT 0,
  years_experience INT DEFAULT 1,
  languages TEXT[] DEFAULT ARRAY['English'],
  specialties TEXT[] DEFAULT ARRAY['Wildlife Safaris'],
  verified BOOLEAN DEFAULT TRUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Tours table
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_hours INT NOT NULL DEFAULT 4,
  price_usd NUMERIC(10, 2) NOT NULL,
  max_group_size INT DEFAULT 8,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can view verified guides" 
  ON public.guides FOR SELECT 
  USING (verified = TRUE);

CREATE POLICY "Public can view tours" 
  ON public.tours FOR SELECT 
  USING (TRUE);

CREATE POLICY "Public can view reviews" 
  ON public.reviews FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Sample Seed Data for Zimbabwe Guides
INSERT INTO public.guides (name, bio, country, location, avatar_url, cover_image_url, rating, reviews_count, years_experience, languages, specialties, verified, phone)
VALUES 
(
  'Tendai Moyo',
  'Certified Safari Guide with 12+ years of experience across Victoria Falls, Zambezi National Park, and Mana Pools. Specialist in Big 5 tracking and photographic safaris.',
  'Zimbabwe',
  'Victoria Falls, Zimbabwe',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
  4.95,
  142,
  12,
  ARRAY['English', 'Shona', 'Ndebele'],
  ARRAY['Big 5 Walking Safaris', 'Victoria Falls Rainforest', 'Birdwatching'],
  TRUE,
  '+263 77 123 4567'
),
(
  'Farai Chitepo',
  'Hwange National Park native tracker and cultural storyteller. Specialist in elephant behavior, predator tracking, and nocturnal game drives.',
  'Zimbabwe',
  'Hwange, Zimbabwe',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
  5.00,
  98,
  15,
  ARRAY['English', 'Ndebele', 'Tonga'],
  ARRAY['Hwange Wildlife Drives', 'Bush Tracking', 'Star Gazing'],
  TRUE,
  '+263 71 987 6543'
),
(
  'Blessing Ndlovu',
  'Historian and wilderness explorer specializing in Great Zimbabwe ruins, Matobo Hills granite formations, and ancient San rock art.',
  'Zimbabwe',
  'Bulawayo & Matobo, Zimbabwe',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  4.90,
  76,
  9,
  ARRAY['English', 'Ndebele'],
  ARRAY['Matobo Rhino Tracking', 'San Rock Art', 'Great Zimbabwe'],
  TRUE,
  '+263 78 456 7890'
);

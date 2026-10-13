-- ================================================================
-- AfriGuide Supabase Database Schema
-- Run this in your Supabase Project -> SQL Editor
-- ================================================================

-- 1. Profiles Table (Tourists & Guides)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'guide', 'admin')),
  avatar_url TEXT DEFAULT '/images/user_avatar.png',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tours Table (Created by Guides, Browsed by Tourists)
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Safari & Wildlife',
  description TEXT,
  duration TEXT DEFAULT 'Full day (8 hours)',
  price_per_person NUMERIC NOT NULL DEFAULT 85,
  max_group_size INT DEFAULT 10,
  location TEXT NOT NULL DEFAULT 'Victoria Falls, Zimbabwe',
  image_url TEXT DEFAULT '/images/safari_guide_elephants.jpg',
  guide_name TEXT DEFAULT 'Kristin Watson',
  guide_avatar TEXT DEFAULT '/images/user_avatar.png',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bookings Table (Tourists booking tours with Guides)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_name TEXT NOT NULL DEFAULT 'Cody Fisher',
  tourist_email TEXT,
  tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
  tour_title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Victoria Falls, Zimbabwe',
  tour_image_url TEXT DEFAULT '/images/safari_guide_elephants.jpg',
  date TEXT NOT NULL,
  time_slot TEXT DEFAULT '09:00am-17:00pm',
  party_size INT DEFAULT 1,
  price_per_person NUMERIC NOT NULL DEFAULT 85,
  total_price NUMERIC NOT NULL DEFAULT 85,
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending', 'Completed', 'Cancelled')),
  guide_name TEXT DEFAULT 'Kristin Watson',
  guide_avatar TEXT DEFAULT '/images/user_avatar.png',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Messages Table (Chat between tourists and guides)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_avatar TEXT DEFAULT '/images/user_avatar.png',
  receiver_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for our MVP so both tourists & guides can interact seamlessly
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public tours access" ON public.tours;
CREATE POLICY "Public tours access" ON public.tours FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public bookings access" ON public.bookings;
CREATE POLICY "Public bookings access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public messages access" ON public.messages;
CREATE POLICY "Public messages access" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for messages, bookings, and tours
ALTER PUBLICATION supabase_realtime ADD TABLE public.tours;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ================================================================
-- Initial Seed Data
-- ================================================================

-- Seed Initial Tours
INSERT INTO public.tours (title, category, description, duration, price_per_person, max_group_size, location, image_url, guide_name, status)
VALUES 
  ('Sunset Safari Guide', 'Safari & Wildlife', 'Experience breathtaking views of Victoria Falls and surrounding wildlife during the golden sunset hour.', 'Full day (8h)', 182, 8, 'Victoria Falls, Zimbabwe', '/images/safari_guide_elephants.jpg', 'Kristin Watson', 'active'),
  ('Hwange Elephant Walk', 'Walking Safari', 'Guided walking tour through Hwange tracking magnificent elephant herds safely with licensed professional rangers.', 'Full day (8h)', 182, 6, 'Hwange National Park', '/images/experience_elephant.jpg', 'Kristin Watson', 'active'),
  ('Victoria Falls Safari Tour', 'Game Drive', 'Full safari game drive exploring lions, giraffes, zebras, and natural habitats with expert trackers.', 'Half day (4h)', 120, 10, 'Victoria Falls, Zimbabwe', '/images/zebras_safari.jpg', 'Desire Sibanda', 'active'),
  ('Zambezi River Sunset Cruise', 'Boat Cruise', 'Relaxing boat cruise along the mighty Zambezi river with hippos, crocodiles, and sunset drinks.', '3 hours', 95, 12, 'Livingstone, Zambia', '/images/camel_desert_sunset.jpg', 'Kristin Watson', 'active');

-- Seed Initial Bookings
INSERT INTO public.bookings (tourist_name, tour_title, location, tour_image_url, date, time_slot, party_size, price_per_person, total_price, status, guide_name)
VALUES
  ('Cody Fisher', 'Sunset Safari Guide', 'Victoria Falls, Zimbabwe', '/images/safari_guide_elephants.jpg', 'Oct 22, 2026', '09:00am-17:00pm', 1, 182, 182, 'Confirmed', 'Kristin Watson'),
  ('Annette Black', 'Hwange Elephant Walk', 'Victoria Falls, Zimbabwe', '/images/experience_elephant.jpg', 'Oct 22, 2026', '09:00am-17:00pm', 1, 182, 182, 'Pending', 'Kristin Watson'),
  ('Guy Hawkins', 'Sunset Safari Guide', 'Victoria Falls, Zimbabwe', '/images/experience_elephant.jpg', 'Oct 22, 2026', '09:00am-17:00pm', 1, 182, 182, 'Pending', 'Kristin Watson');

-- Seed Initial Chat Messages
INSERT INTO public.messages (sender_name, sender_avatar, receiver_name, content, is_read)
VALUES
  ('Dianne Russell', '/images/user_avatar.png', 'Kristin Watson', 'Hey man thanks again for the tour it was super amazing will be sure to leave a review!', false),
  ('Eleanor Pena', '/images/user_avatar.png', 'Kristin Watson', 'What time should we meet at the park entrance tomorrow?', false),
  ('Marvin McKinney', '/images/user_avatar.png', 'Kristin Watson', 'Can we bring our own camera equipment on the walking safari?', false);

-- Create enum for moods
CREATE TYPE public.confession_mood AS ENUM ('happy', 'sad', 'angry', 'numb', 'love', 'anxious', 'frustrated', 'peaceful');

-- Create confessions table
CREATE TABLE public.confessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  mood confession_mood NOT NULL,
  tags TEXT[] DEFAULT '{}',
  nickname TEXT DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  like_count INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID REFERENCES public.confessions(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public read access for confessions
CREATE POLICY "Anyone can read confessions" 
ON public.confessions 
FOR SELECT 
USING (true);

-- Anyone can create confessions
CREATE POLICY "Anyone can create confessions" 
ON public.confessions 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update like/report counts
CREATE POLICY "Anyone can update confession counts" 
ON public.confessions 
FOR UPDATE 
USING (true);

-- Public read access for comments
CREATE POLICY "Anyone can read comments" 
ON public.comments 
FOR SELECT 
USING (true);

-- Anyone can create comments
CREATE POLICY "Anyone can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_confessions_created_at ON public.confessions(created_at DESC);
CREATE INDEX idx_confessions_mood ON public.confessions(mood);
CREATE INDEX idx_confessions_like_count ON public.confessions(like_count DESC);
CREATE INDEX idx_comments_confession_id ON public.comments(confession_id);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
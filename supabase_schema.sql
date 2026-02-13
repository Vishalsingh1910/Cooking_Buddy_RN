-- =====================================================
-- Cooking Buddy - Supabase Database Schema
-- =====================================================
-- This script creates all necessary tables, relationships, 
-- indexes, and Row Level Security (RLS) policies.
-- =====================================================

-- =====================================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- =====================================================
-- Note: Supabase auth.users already exists
-- We create a public.users table for additional user data

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all profiles"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- AUTOMATIC USER PROFILE CREATION
-- =====================================================
-- This trigger automatically creates a user profile in public.users
-- when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, display_name, photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    'https://ui-avatars.com/api/?name=' || SPLIT_PART(NEW.email, '@', 1) || '&background=random'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth signup
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. RECIPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recipes (
    recipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    steps TEXT[] NOT NULL DEFAULT '{}',
    cooking_time_minutes INTEGER NOT NULL DEFAULT 30,
    servings INTEGER DEFAULT 4,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    calories INTEGER,
    rating DECIMAL(3,2) DEFAULT 0.0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for recipes
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX idx_recipes_rating ON public.recipes(rating DESC);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Anyone can view recipes"
    ON public.recipes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create recipes"
    ON public.recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
    ON public.recipes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
    ON public.recipes FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 3. RECIPE LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recipe_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(recipe_id, user_id)
);

-- Indexes for recipe_likes
CREATE INDEX idx_recipe_likes_recipe_id ON public.recipe_likes(recipe_id);
CREATE INDEX idx_recipe_likes_user_id ON public.recipe_likes(user_id);

-- Enable RLS
ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipe_likes
CREATE POLICY "Anyone can view likes"
    ON public.recipe_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like recipes"
    ON public.recipe_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own likes"
    ON public.recipe_likes FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 4. RECIPE COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recipe_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for recipe_comments
CREATE INDEX idx_recipe_comments_recipe_id ON public.recipe_comments(recipe_id);
CREATE INDEX idx_recipe_comments_user_id ON public.recipe_comments(user_id);
CREATE INDEX idx_recipe_comments_created_at ON public.recipe_comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipe_comments
CREATE POLICY "Anyone can view comments"
    ON public.recipe_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.recipe_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON public.recipe_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.recipe_comments FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. SAVED RECIPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(recipe_id, user_id)
);

-- Indexes for saved_recipes
CREATE INDEX idx_saved_recipes_recipe_id ON public.saved_recipes(recipe_id);
CREATE INDEX idx_saved_recipes_user_id ON public.saved_recipes(user_id);

-- Enable RLS
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_recipes
CREATE POLICY "Users can view own saved recipes"
    ON public.saved_recipes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes"
    ON public.saved_recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave recipes"
    ON public.saved_recipes FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_comments_updated_at
    BEFORE UPDATE ON public.recipe_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. TRIGGERS FOR COUNTERS
-- =====================================================
-- Update likes_count when recipe_likes changes
CREATE OR REPLACE FUNCTION update_recipe_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.recipes
        SET likes_count = likes_count + 1
        WHERE recipe_id = NEW.recipe_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.recipes
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE recipe_id = OLD.recipe_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipe_likes_count_trigger
    AFTER INSERT OR DELETE ON public.recipe_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_likes_count();

-- Update comments_count when recipe_comments changes
CREATE OR REPLACE FUNCTION update_recipe_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.recipes
        SET comments_count = comments_count + 1
        WHERE recipe_id = NEW.recipe_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.recipes
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE recipe_id = OLD.recipe_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipe_comments_count_trigger
    AFTER INSERT OR DELETE ON public.recipe_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_comments_count();

-- =====================================================
-- 8. STORAGE BUCKET FOR RECIPE IMAGES
-- =====================================================
-- Run this in Supabase Dashboard > Storage or via SQL:
-- Note: This uses Supabase Storage API, not pure SQL

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policy
CREATE POLICY "Anyone can view recipe images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'recipe-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own recipe images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'recipe-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own recipe images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'recipe-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- 9. SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment to insert sample data

/*
-- Insert sample user (requires auth.users entry first)
INSERT INTO public.users (id, display_name, photo_url, bio)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Chef Gordon', 'https://i.pravatar.cc/150?img=12', 'Professional chef with 20 years of experience');

-- Insert sample recipes
INSERT INTO public.recipes (recipe_id, user_id, title, description, image_url, ingredients, steps, cooking_time_minutes, difficulty, calories, rating)
VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000001',
        'Classic Spaghetti Carbonara',
        'A traditional Italian pasta dish made with eggs, cheese, and pancetta.',
        'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
        ARRAY['400g spaghetti', '200g pancetta', '4 eggs', '100g Parmesan cheese', 'Black pepper', 'Salt'],
        ARRAY['Boil water and cook spaghetti', 'Fry pancetta until crispy', 'Mix eggs and cheese', 'Combine all ingredients', 'Serve hot with extra cheese'],
        25,
        'Medium',
        520,
        4.8
    );
*/

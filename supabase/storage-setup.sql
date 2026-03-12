-- =============================================================================
-- SUPABASE STORAGE SETUP: property-images bucket
-- =============================================================================
--
-- Run this in Supabase SQL Editor to create the storage bucket and policies.
-- For v1: public read, anon write (no authentication required)
--
-- =============================================================================

-- Create the storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Policy: Allow public read access to all files
CREATE POLICY "Public read access for property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Policy: Allow anonymous upload (INSERT)
CREATE POLICY "Anon upload access for property images"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'property-images');

-- Policy: Allow anonymous update
CREATE POLICY "Anon update access for property images"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'property-images');

-- Policy: Allow anonymous delete
CREATE POLICY "Anon delete access for property images"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'property-images');

-- =============================================================================
-- NOTES
-- =============================================================================
--
-- WARNING: These policies allow anyone to upload/delete images.
-- This is intentional for v1 without authentication.
--
-- For production, you should:
-- 1. Add authentication to admin panel
-- 2. Change policies to use 'authenticated' role instead of 'anon'
-- 3. Consider adding file size limits at application level
--
-- To verify bucket was created:
-- SELECT * FROM storage.buckets WHERE id = 'property-images';
--
-- To verify policies:
-- SELECT * FROM storage.policies WHERE bucket_id = 'property-images';
--
-- =============================================================================

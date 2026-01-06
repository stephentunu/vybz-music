-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own uploaded songs" ON public.uploaded_songs;

-- Create new policy to allow everyone to view all uploaded songs
CREATE POLICY "Anyone can view all uploaded songs" 
ON public.uploaded_songs 
FOR SELECT 
USING (true);
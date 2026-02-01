import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqlkckgbxlfdtsslxufl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbGtja2dieGxmZHRzc2x4dWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjYyNTIsImV4cCI6MjA4NTU0MjI1Mn0.rACnferkGHSdqqPyR6WHklWNupEij4iQF2KMKi3ZKDE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
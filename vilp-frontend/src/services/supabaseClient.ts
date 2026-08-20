import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pabrkfwturuzewbkswwu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYnJrZnd0dXJ1emV3Ymtzd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzg3MjEsImV4cCI6MjEwMjc1NDcyMX0.udw73_om6CQrV2VXJ3KHQBLO1Ek-weVqcOYve_BVQko';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

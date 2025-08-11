// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqoookhlqruzaytlcuce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb29va2hscXJ1emF5dGxjdWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTc4NDIsImV4cCI6MjA3MDQ5Mzg0Mn0.SsUNWKYINY5Tf-i2saMklLzaUd9lTjMeEvEvT1NgwSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

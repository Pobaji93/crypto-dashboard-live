// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ezdadkqnjejqjlgbysli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZGFka3FuamVqcWpsZ2J5c2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjM3MTUsImV4cCI6MjA2MDgzOTcxNX0.ZPGOaJ_4dtPsXcbz479WUqTyZ__YcjAx7SDx-BwvQLI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// lib/supabase.ts — Cliente Supabase para Aula Verde
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqlcmrzkppdfpoqglskn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbGNtcnprcHBkZnBvcWdsc2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDE3MTMsImV4cCI6MjA5ODUxNzcxM30.4xlHIm6f8UX2Q_9T1HRBmO6nZkkEEZLK4LqwHeIMJQo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

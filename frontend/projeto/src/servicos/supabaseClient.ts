import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto';

//credenciais do Supabase
const SUPABASE_URL = "https://ekgcdtwesrobueaybpft.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZ2NkdHdlc3JvYnVlYXlicGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODk0MzgsImV4cCI6MjA3Mjk2NTQzOH0.ovcIGCDk0mJj1RhP3hpa54FYmOdmBVuHlZ0v3FaGHLo";


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

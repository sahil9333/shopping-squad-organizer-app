// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kvpghaxihhgsvetmuzet.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2cGdoYXhpaGhnc3ZldG11emV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjU5MjksImV4cCI6MjA2MDU0MTkyOX0.mpu8MCeE3VDBhkX96rbXXb_vSGkwnaaoG1KQpXHjE7w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
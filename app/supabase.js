// supabase.js
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const SUPABASE_URL = "https://pegamjwyssxrjkrelrxl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZ2Ftand5c3N4cmprcmVscnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjA5NjYsImV4cCI6MjA3OTE5Njk2Nn0.tZohG25Gn_uybfeow63QwtcmmtvDH6SQ-Js_NjbYsTY";

const redirectUrl = Linking.createURL('/'); 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {

    auth: {
        
        redirectTo: redirectUrl, 
    }
});

console.log("Supabase Redirect URL:", redirectUrl);
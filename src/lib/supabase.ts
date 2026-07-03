import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njfgrdpoqxuukdpkwihl.supabase.co'
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_V3qOIGtHtN60dPpiXfB2hQ_qgmi_m8M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

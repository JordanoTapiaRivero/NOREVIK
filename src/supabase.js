import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jotyjpevpdzdtvwjgghd.supabase.co'
const supabaseAnonKey = 'sb_publishable_GFEhT2g9QPzQnobApNlk1w_iK8JNhiS'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
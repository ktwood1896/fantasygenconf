import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // PASTE YOUR REAL KEYS INSIDE THE QUOTES BELOW
  const myUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! 
  const myKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 

  return createServerClient(
    myUrl,
    myKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}
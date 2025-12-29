import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Session, User } from '@supabase/supabase-js'

type Profile = {
  username?: string
  avatar_url?: string
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  refreshProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // Ignore not found error
         console.error('Error fetching profile:', error)
         return
      }

      const profileData: Profile = { username: data?.username }

      if (data?.avatar_url) {
        const { data: imageData } = await supabase.storage
          .from('avatars')
          .createSignedUrl(data.avatar_url, 3600)

        if (imageData?.signedUrl) {
          profileData.avatar_url = imageData.signedUrl
        }
      }
      
      setProfile(profileData)
    } catch (e) {
      console.error('Exception fetching profile:', e)
    }
  }

  const refreshProfile = async () => {
    if (user) {
        await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        // Safe guard: force stop loading after 5 seconds
        const timeout = setTimeout(() => {
            if (isLoading) {
                console.warn('Auth session request timed out, forcing app load')
                setIsLoading(false)
            }
        }, 5000)

        const {
          data: { session },
        } = await supabase.auth.getSession()
        
        clearTimeout(timeout)
        
        setSession(session)
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
            await fetchProfile(currentUser.id)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao obter sessão:', error)
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }
      
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

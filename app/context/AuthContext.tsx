import { Session } from "@supabase/supabase-js"
import { createContext, FC, PropsWithChildren, useEffect, useState, useContext } from "react"
import { supabase } from "@/services/supabase/supabase"
import { UserService, UserProfile } from "@/services/api/UserService"

export type AuthContextType = {
  isAuthenticated: boolean
  session: Session | null
  userProfile: UserProfile | null
  userEmail?: string
  isLoading: boolean
  checkUser: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadUserProfile = async (userId: string) => {
    const profile = await UserService.getUserProfile(userId)
    setUserProfile(profile)

    // If no profile exists, create one from auth metadata
    if (!profile) {
      const newProfile = await UserService.createProfileFromAuth()
      setUserProfile(newProfile)
    }
  }

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsAuthenticated(!!session)

      if (session?.user?.id) {
        loadUserProfile(session.user.id)
      }

      setIsLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsAuthenticated(!!session)

      if (session?.user?.id) {
        loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setSession(null)
    setUserProfile(null)
  }

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setIsAuthenticated(!!session)

    if (session?.user?.id) {
      await loadUserProfile(session.user.id)
    }
  }

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await loadUserProfile(session.user.id)
    }
  }

  const value = {
    isAuthenticated,
    session,
    userProfile,
    userEmail: session?.user?.email,
    isLoading,
    logout,
    checkUser,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

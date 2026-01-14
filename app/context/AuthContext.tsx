import { Session } from "@supabase/supabase-js"
import { createContext, FC, PropsWithChildren, useEffect, useState, useContext } from "react"
import { supabase } from "@/services/supabase/supabase"

export type AuthContextType = {
  isAuthenticated: boolean
  session: Session | null
  userEmail?: string
  isLoading: boolean
  checkUser: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setSession(null)
  }

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setIsAuthenticated(!!session)
  }

  const value = {
    isAuthenticated,
    session,
    userEmail: session?.user?.email,
    isLoading,
    logout,
    checkUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

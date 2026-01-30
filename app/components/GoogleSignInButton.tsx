import React from 'react'
import { Button } from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as QueryParams from 'expo-auth-session/build/QueryParams'

import { supabase } from '@/services/supabase/supabase'
import { useAuth } from '@/context/AuthContext'  // <-- your existing context

WebBrowser.maybeCompleteAuthSession()

const redirectTo = makeRedirectUri({
  scheme: 'com.startup.cooking_buddy',
  path: 'auth/callback',
})

console.log('REDIRECT TO:', redirectTo)

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url)

  if (errorCode) throw new Error(errorCode)

  const { access_token, refresh_token } = params

  if (!access_token) return null

  // Write session to Supabase
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

  if (error) throw error

  // 👇 THIS AUTOMATICALLY TRIGGERS YOUR NAVIGATION LOGIC
  // if (data.session?.access_token) {
  //   setAuthToken(data.session.access_token)
  // }

  return data.session
}

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })

  if (error) {
    console.log('OAuth error:', error)
    return
  }

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? '',
    redirectTo
  )

  if (res.type === 'success' && res.url) {
    await createSessionFromUrl(res.url)
  }
}

export default function GoogleSignInButton() {
  //   const { setAuthToken } = useAuth()  // your existing setter
  const url = Linking.useURL()

  // Handle deep link (for Android/iOS returning to app)
  React.useEffect(() => {
    if (url) {
      createSessionFromUrl(url)
    }
  }, [url])

  return (
    <Button
      title="Continue with Google"
      onPress={() => signInWithGoogle()}
    />
  )
}

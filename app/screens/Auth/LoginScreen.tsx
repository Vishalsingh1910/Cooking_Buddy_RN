import React, { FC, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  TextInput,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Keyboard,
} from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { supabase } from "@/services/supabase/supabase"

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const passwordRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { checkUser } = useAuth()
  const { themed, theme } = useAppTheme()

  const isSubmittingRef = useRef(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const emailError =
    isSubmitted && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())
      ? "Please enter a valid email address"
      : ""
  const passwordError =
    isSubmitted && password.length < 6
      ? "Password must be at least 6 characters"
      : ""

  async function login() {
    Keyboard.dismiss()
    setIsSubmitted(true)

    if (emailError || passwordError) return

    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        Alert.alert("Login Failed", error.message ?? "Unable to sign in")
        return
      }

      const session = data?.session
      if (!session) {
        Alert.alert("Login Failed", "No active session returned from Supabase.")
        return
      }

      // Success - context listener will handle navigation
      if (isMountedRef.current) {
        // Navigation handled by AuthContext
      }
    } catch (e) {
      console.error("Login exception:", e)
      Alert.alert("Login Failed", String(e))
    } finally {
      if (isMountedRef.current) setIsLoading(false)
      isSubmittingRef.current = false
    }
  }

  const PasswordRightAccessory = React.useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isPasswordHidden ? "view" : "hidden"}
            color={theme.colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsPasswordHidden((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Toggle password visibility"
          />
        )
      },
    [isPasswordHidden, theme.colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      {/* Logo */}
      <View style={themed($logoContainer)}>
        <View style={themed($logoBox)}>
          <PressableIcon icon="chef" size={48} color="#fff" />
        </View>
        <Text preset="heading" style={themed($appName)}>
          Cooking Buddy
        </Text>
      </View>

      {/* Title */}
      <View style={themed($titleContainer)}>
        <Text preset="heading" style={themed($title)}>
          Welcome Back
        </Text>
        <Text style={themed($subtitle)}>
          Log in to continue cooking
        </Text>
      </View>

      {/* Form */}
      <View style={themed($form)}>
        <TextField
          ref={emailRef}
          value={email}
          onChangeText={setEmail}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx={undefined}
          placeholder="Email address"
          helper={emailError}
          status={emailError ? "error" : undefined}
          onSubmitEditing={() => passwordRef.current?.focus()}
          LeftAccessory={(props) => (
            <View style={props.style}>
              <PressableIcon
                icon="community"
                size={20}
                color={theme.colors.palette.neutral600}
              />
            </View>
          )}
        />

        <TextField
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isPasswordHidden}
          labelTx={undefined}
          placeholder="Password"
          helper={passwordError}
          status={passwordError ? "error" : undefined}
          onSubmitEditing={login}
          RightAccessory={PasswordRightAccessory}
          LeftAccessory={(props) => (
            <View style={props.style}>
              <PressableIcon
                icon="lock"
                size={20}
                color={theme.colors.palette.neutral600}
              />
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={themed($forgotButton)}
          activeOpacity={0.7}
        >
          <Text style={themed($forgotText)}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          testID="login-button"
          onPress={login}
          style={themed($loginButton)}
          pressedStyle={themed($loginButtonPressed)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={themed($loginButtonText)}>Log In</Text>
          )}
        </Button>
      </View>

      {/* Sign up link */}
      <View style={themed($signupRow)}>
        <Text style={themed($signupText)}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          activeOpacity={0.7}
        >
          <Text style={themed($signupLink)}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

/* Styles */
const $screenContentContainer = ({ spacing }: any) =>
({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
} as ViewStyle)

const $logoContainer = ({ spacing }: any) =>
({
  alignItems: "center",
  marginTop: spacing.xxl,
  marginBottom: spacing.xl,
} as ViewStyle)

const $logoBox = ({ colors, spacing }: any) =>
({
  width: 100,
  height: 100,
  borderRadius: 24,
  backgroundColor: colors.palette.appPrimary,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.md,
  shadowColor: colors.palette.appPrimary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8,
} as ViewStyle)

const $appName = ({ spacing }: any) =>
({
  fontSize: 24,
  fontWeight: "700",
  textAlign: "center",
} as TextStyle)

const $titleContainer = ({ spacing }: any) =>
({
  alignItems: "center",
  marginBottom: spacing.xl,
} as ViewStyle)

const $title = ({ }: any) =>
({
  fontSize: 32,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 8,
} as TextStyle)

const $subtitle = ({ colors }: any) =>
({
  fontSize: 16,
  textAlign: "center",
  color: colors.palette.neutral600,
} as TextStyle)

const $form = ({ spacing }: any) =>
({
  width: "100%",
  marginBottom: spacing.lg,
} as ViewStyle)

const $textField = ({ spacing }: any) =>
({
  marginBottom: spacing.lg,
} as ViewStyle)

const $forgotButton = ({ spacing }: any) =>
({
  alignSelf: "flex-end",
  marginBottom: spacing.md,
} as ViewStyle)

const $forgotText = ({ colors }: any) =>
({
  fontSize: 14,
  color: colors.palette.appPrimary,
  fontWeight: "600",
} as TextStyle)

const $loginButton = ({ colors, spacing }: any) =>
({
  borderRadius: 16,
  backgroundColor: colors.palette.appPrimary,
  paddingVertical: 16,
  marginTop: spacing.sm,
  shadowColor: colors.palette.appPrimary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
} as ViewStyle)

const $loginButtonPressed = ({ colors }: any) =>
({
  backgroundColor: colors.palette.appPrimary,
  opacity: 0.8,
} as ViewStyle)

const $loginButtonText = ({ }: any) =>
({
  fontSize: 18,
  fontWeight: "600",
  color: "#fff",
} as TextStyle)

const $signupRow = ({ spacing }: any) =>
({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.xl,
} as ViewStyle)

const $signupText = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.neutral600,
} as TextStyle)

const $signupLink = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.appPrimary,
  fontWeight: "700",
} as TextStyle)

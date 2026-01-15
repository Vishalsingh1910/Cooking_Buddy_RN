import React, { FC, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  Keyboard,
} from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { supabase } from "@/services/supabase/supabase"

interface SignupScreenProps extends AppStackScreenProps<"SignUp"> { }

export const SignupScreen: FC<SignupScreenProps> = ({ navigation }) => {
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const { themed, theme } = useAppTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emailError =
    isSubmitted && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())
      ? "Please enter a valid email address"
      : ""
  const passwordError =
    isSubmitted && password.length < 6
      ? "Password must be at least 6 characters"
      : ""

  async function signup() {
    Keyboard.dismiss()
    setIsSubmitted(true)

    if (emailError || passwordError) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      })

      if (error) {
        Alert.alert("Signup Failed", error.message)
        return
      }

      // Success! The database trigger will automatically create the user profile
      Alert.alert(
        "Success! 🎉",
        "Please check your email to verify your account. Once verified, you can log in and start cooking!",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]
      )
    } catch (e) {
      Alert.alert("Signup Failed", String(e))
    } finally {
      setIsLoading(false)
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
      {/* Back Button */}
      <View style={themed($header)}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={themed($backButton)}
          activeOpacity={0.7}
        >
          <PressableIcon icon="caretLeft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

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
          Create Account
        </Text>
        <Text style={themed($subtitle)}>
          Join our community of food lovers
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
          LeftAccessory={() => (
            <PressableIcon
              icon="community"
              size={20}
              color={theme.colors.palette.neutral600}
            />
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
          placeholder="Password (min. 6 characters)"
          helper={passwordError}
          status={passwordError ? "error" : undefined}
          onSubmitEditing={signup}
          RightAccessory={PasswordRightAccessory}
          LeftAccessory={() => (
            <PressableIcon
              icon="lock"
              size={20}
              color={theme.colors.palette.neutral600}
            />
          )}
        />

        <Button
          testID="signup-button"
          onPress={signup}
          style={themed($signupButton)}
          pressedStyle={themed($signupButtonPressed)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={themed($signupButtonText)}>Create Account</Text>
          )}
        </Button>

        <Text style={themed($termsText)}>
          By signing up, you agree to our{" "}
          <Text style={themed($termsLink)}>Terms of Service</Text> and{" "}
          <Text style={themed($termsLink)}>Privacy Policy</Text>
        </Text>
      </View>

      {/* Login link */}
      <View style={themed($loginRow)}>
        <Text style={themed($loginText)}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={themed($loginLink)}>Log In</Text>
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

const $header = ({ spacing }: any) =>
({
  width: "100%",
  paddingTop: spacing.xs,
  paddingBottom: spacing.md,
} as ViewStyle)

const $backButton = ({ spacing }: any) =>
({
  padding: spacing.xs,
  marginLeft: -8,
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
} as ViewStyle)

const $logoContainer = ({ spacing }: any) =>
({
  alignItems: "center",
  marginTop: spacing.md,
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

const $signupButton = ({ colors, spacing }: any) =>
({
  borderRadius: 16,
  backgroundColor: colors.palette.appPrimary,
  paddingVertical: 16,
  marginTop: spacing.md,
  marginBottom: spacing.md,
  shadowColor: colors.palette.appPrimary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
} as ViewStyle)

const $signupButtonPressed = ({ colors }: any) =>
({
  backgroundColor: colors.palette.appPrimary,
  opacity: 0.8,
} as ViewStyle)

const $signupButtonText = ({ }: any) =>
({
  fontSize: 18,
  fontWeight: "600",
  color: "#fff",
} as TextStyle)

const $termsText = ({ colors, spacing }: any) =>
({
  fontSize: 12,
  textAlign: "center",
  color: colors.palette.neutral500,
  lineHeight: 18,
  paddingHorizontal: spacing.md,
} as TextStyle)

const $termsLink = ({ colors }: any) =>
({
  color: colors.palette.appPrimary,
  fontWeight: "600",
} as TextStyle)

const $loginRow = ({ spacing }: any) =>
({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.lg,
} as ViewStyle)

const $loginText = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.neutral600,
} as TextStyle)

const $loginLink = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.appPrimary,
  fontWeight: "700",
} as TextStyle)

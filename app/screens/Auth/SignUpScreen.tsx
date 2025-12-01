import React, { FC, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

interface SignupScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignupScreen: FC<SignupScreenProps> = ({ navigation }) => {
  const nameRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const { themed, theme } = useAppTheme()
  const { setAuthToken } = useAuth() // reuse your auth setter

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const nameError = isSubmitted && name.trim().length < 2 ? "Name must be at least 2 characters" : ""
  const emailError =
    isSubmitted && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim()) ? "Please enter a valid email" : ""
  const passwordError = isSubmitted && password.length < 6 ? "Password must be at least 6 characters" : ""

  async function signup() {
    setIsSubmitted(true)
    if (nameError || emailError || passwordError) return

    setIsLoading(true)
    try {
      // Replace with actual signup API call (AuthService.createUserWithEmailAndPassword)
      await new Promise((res) => setTimeout(res, 900))

      // on success, set token and navigate
      setAuthToken(String(Date.now()))
    //   navigation.replace("Main")
    } catch (e) {
      Alert.alert("Signup failed", String(e))
    } finally {
      setIsLoading(false)
    }
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    try {
      // replace with real google sign-in
      await new Promise((res) => setTimeout(res, 900))
      setAuthToken("google:" + String(Date.now()))
    //   navigation.replace("Main")
    } catch (e) {
      Alert.alert("Google sign-in failed", String(e))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const PasswordRightAccessory = useMemo(
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
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top", "bottom"]}>
      {/* AppBar back button similar to Flutter's AppBar */}
      <View style={themed($appBar)}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={themed($backButton)}>
          <PressableIcon icon="caretLeft" size={24} color={theme.colors.palette.neutral800} />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={themed($logoBox)}>
        <PressableIcon icon="chef" size={40} color="#fff" />
      </View>

      <View style={themed($spacer)} />

      {/* Auth Card */}
      <View style={themed($authCard)}>
        <Text preset="heading" style={themed($authTitle)}>
          Create Account
        </Text>

        <View style={themed($form)}>
          <TextField
            ref={nameRef}
            value={name}
            onChangeText={setName}
            containerStyle={themed($textField)}
            autoCapitalize="words"
            autoCorrect={false}
            labelTx={undefined}
            placeholder="Full Name"
            helper={nameError}
            status={nameError ? "error" : undefined}
            onSubmitEditing={() => emailRef.current?.focus()}
            LeftAccessory={() => <PressableIcon icon="components" size={18} color={theme.colors.palette.neutral600} />}
          />

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
            placeholder="Email"
            helper={emailError}
            status={emailError ? "error" : undefined}
            onSubmitEditing={() => passwordRef.current?.focus()}
            LeftAccessory={() => <PressableIcon icon="github" size={18} color={theme.colors.palette.neutral600} />}
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
            onSubmitEditing={signup}
            RightAccessory={PasswordRightAccessory}
            LeftAccessory={() => <PressableIcon icon="lock" size={18} color={theme.colors.palette.neutral600} />}
          />

          <View style={themed($signupButtonWrapper)}>
            <Button
              testID="signup-button"
              onPress={signup}
              style={themed($signupButton)}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color={theme.colors.palette.accent100} /> : <Text style={themed($signupButtonText)}>Sign Up</Text>}
            </Button>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={themed($dividerRow)}>
        <View style={themed($dividerLine)} />
        <Text style={themed($dividerText)}>or continue with</Text>
        <View style={themed($dividerLine)} />
      </View>

      {/* Social login */}
      <TouchableOpacity style={themed($socialButton)} onPress={signInWithGoogle} disabled={isGoogleLoading}>
        <PressableIcon icon="github" size={20} color={theme.colors.palette.neutral800} containerStyle={themed($socialIcon)} />
        {isGoogleLoading ? <ActivityIndicator style={themed($socialLoader)} /> : <Text style={themed($socialText)}>Continue with Google</Text>}
      </TouchableOpacity>

      {/* Login link */}
      <View style={themed($loginRow)}>
        <Text style={themed($noAccount)}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed($loginLink)}>Login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

/* Styles */
const $screenContentContainer = ({ spacing }: any) =>
  ({
    padding: spacing.lg,
    alignItems: "center",
  } as ViewStyle)

const $appBar = ({}: any) =>
  ({
    width: "100%",
    paddingTop: 0,
    paddingBottom: 0,
  } as ViewStyle)

const $backButton = ({ spacing }: any) =>
  ({
    padding: spacing.xs,
    marginLeft: -8,
  } as ViewStyle)

const $logoBox = ({ colors }: any) =>
  ({
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.palette.secondary,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle)

const $spacer = ({ spacing }: any) =>
  ({
    height: 24,
  } as ViewStyle)

const $authCard = ({ colors, spacing }: any) =>
  ({
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle)

const $authTitle = ({ spacing }: any) =>
  ({
    textAlign: "center",
    marginBottom: spacing.md,
  } as TextStyle)

const $form = ({}: any) =>
  ({
    width: "100%",
  } as ViewStyle)

const $textField = ({ spacing }: any) =>
  ({
    marginBottom: spacing.md,
  } as ViewStyle)

const $signupButtonWrapper = ({ spacing }: any) =>
  ({
    marginTop: spacing.sm,
  } as ViewStyle)

const $signupButton = ({ colors }: any) =>
  ({
    borderRadius: 25,
    backgroundColor: colors.palette.appPrimary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle)

const $signupButtonText = ({ }: any) =>
  ({
    fontSize: 16,
    fontWeight: "600",
    color: undefined, // Button will set text color; you can force theme color if needed
  } as TextStyle)

const $dividerRow = ({ spacing }: any) =>
  ({
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    width: "100%",
  } as ViewStyle)

const $dividerLine = ({ colors }: any) =>
  ({
    flex: 1,
    height: 1,
    backgroundColor: colors.palette.neutral300,
  } as ViewStyle)

const $dividerText = ({ spacing, colors }: any) =>
  ({
    marginHorizontal: spacing.md,
    color: colors.palette.neutral500,
  } as TextStyle)

const $socialButton = ({ colors, spacing }: any) =>
  ({
    marginTop: 16,
    width: "100%",
    backgroundColor: colors.palette.neutral0,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
  } as ViewStyle)

const $socialIcon = ({ spacing }: any) =>
  ({
    marginRight: spacing.md,
  } as ViewStyle)

const $socialText = ({ colors }: any) =>
  ({
    color: colors.textPrimary,
    fontWeight: "500",
  } as TextStyle)

const $socialLoader = ({ spacing }: any) =>
  ({
    marginLeft: spacing.md,
  } as ViewStyle)

const $loginRow = ({ spacing }: any) =>
  ({
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  } as ViewStyle)

const $noAccount = ({ colors }: any) =>
  ({
    color: colors.palette.neutral600,
    marginRight: 6,
  } as TextStyle)

const $loginLink = ({ colors }: any) =>
  ({
    color: colors.palette.appPrimary,
    fontWeight: "600",
  } as TextStyle)

// import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// // eslint-disable-next-line no-restricted-imports
// import { TextInput, TextStyle, ViewStyle } from "react-native"

// import { Button } from "@/components/Button"
// import { PressableIcon } from "@/components/Icon"
// import { Screen } from "@/components/Screen"
// import { Text } from "@/components/Text"
// import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
// import { useAuth } from "@/context/AuthContext"
// import type { AppStackScreenProps } from "@/navigators/navigationTypes"
// import type { ThemedStyle } from "@/theme/types"
// import { useAppTheme } from "@/theme/context"

// interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

// export const LoginScreen: FC<LoginScreenProps> = () => {
//   const authPasswordInput = useRef<TextInput>(null)

//   const [authPassword, setAuthPassword] = useState("")
//   const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [attemptsCount, setAttemptsCount] = useState(0)
//   const { authEmail, setAuthEmail, setAuthToken, validationError } = useAuth()

//   const {
//     themed,
//     theme: { colors },
//   } = useAppTheme()

//   useEffect(() => {
//     // Here is where you could fetch credentials from keychain or storage
//     // and pre-fill the form fields.
//     setAuthEmail("ignite@infinite.red")
//     setAuthPassword("ign1teIsAwes0m3")
//   }, [setAuthEmail])

//   const error = isSubmitted ? validationError : ""

//   function login() {
//     setIsSubmitted(true)
//     setAttemptsCount(attemptsCount + 1)

//     if (validationError) return

//     // Make a request to your server to get an authentication token.
//     // If successful, reset the fields and set the token.
//     setIsSubmitted(false)
//     setAuthPassword("")
//     setAuthEmail("")

//     // We'll mock this with a fake token.
//     setAuthToken(String(Date.now()))
//   }

//   const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
//     () =>
//       function PasswordRightAccessory(props: TextFieldAccessoryProps) {
//         return (
//           <PressableIcon
//             icon={isAuthPasswordHidden ? "view" : "hidden"}
//             color={colors.palette.neutral800}
//             containerStyle={props.style}
//             size={20}
//             onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
//           />
//         )
//       },
//     [isAuthPasswordHidden, colors.palette.neutral800],
//   )

//   return (
//     <Screen
//       preset="auto"
//       contentContainerStyle={themed($screenContentContainer)}
//       safeAreaEdges={["top", "bottom"]}
//     >
//       <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
//       <Text tx="loginScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
//       {attemptsCount > 2 && (
//         <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
//       )}

//       <TextField
//         value={authEmail}
//         onChangeText={setAuthEmail}
//         containerStyle={themed($textField)}
//         autoCapitalize="none"
//         autoComplete="email"
//         autoCorrect={false}
//         keyboardType="email-address"
//         labelTx="loginScreen:emailFieldLabel"
//         placeholderTx="loginScreen:emailFieldPlaceholder"
//         helper={error}
//         status={error ? "error" : undefined}
//         onSubmitEditing={() => authPasswordInput.current?.focus()}
//       />

//       <TextField
//         ref={authPasswordInput}
//         value={authPassword}
//         onChangeText={setAuthPassword}
//         containerStyle={themed($textField)}
//         autoCapitalize="none"
//         autoComplete="password"
//         autoCorrect={false}
//         secureTextEntry={isAuthPasswordHidden}
//         labelTx="loginScreen:passwordFieldLabel"
//         placeholderTx="loginScreen:passwordFieldPlaceholder"
//         onSubmitEditing={login}
//         RightAccessory={PasswordRightAccessory}
//       />

//       <Button
//         testID="login-button"
//         tx="loginScreen:tapToLogIn"
//         style={themed($tapButton)}
//         preset="reversed"
//         onPress={login}
//       />
//     </Screen>
//   )
// }

// const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
//   paddingVertical: spacing.xxl,
//   paddingHorizontal: spacing.lg,
// })

// const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
//   marginBottom: spacing.sm,
// })

// const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
//   marginBottom: spacing.lg,
// })

// const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
//   color: colors.tint,
//   marginBottom: spacing.md,
// })

// const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
//   marginBottom: spacing.lg,
// })

// const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
//   marginTop: spacing.xs,
// })

import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  TextInput,
  View,
  TouchableOpacity,
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

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { authEmail, setAuthEmail, setAuthToken, validationError } = useAuth()
  const { themed, theme } = useAppTheme()

  useEffect(() => {
    // demo default values like your original screen
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")
  }, [setAuthEmail])

  const error = isSubmitted ? validationError : ""

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount((c) => c + 1)

    if (validationError) return

    setIsLoading(true)
    try {
      // Replace with real auth call. Here we mock a delay.
      await new Promise((res) => setTimeout(res, 900))

      // Mock success: set token and navigate to main/home
      setAuthToken(String(Date.now()))

      // Replace "Main" with your main navigator route name if different
      // navigation.replace("Demo")
    } catch (e) {
      Alert.alert("Login failed", String(e))
    } finally {
      setIsLoading(false)
    }
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    try {
      // call your real google sign-in service
      await new Promise((res) => setTimeout(res, 900))
      setAuthToken("google:" + String(Date.now()))
      // navigation.replace("Demo")
    } catch (e) {
      Alert.alert("Google sign-in failed", String(e))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const PasswordRightAccessory: React.ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={theme.colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Toggle password visibility"
          />
        )
      },
    [isAuthPasswordHidden, theme.colors.palette.neutral800],
  )

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top"]}>
      {/* Logo box similar to Flutter */}
      <View style={themed($logoBox)}>
        <PressableIcon icon="chef" size={40} color="#fff" />
      </View>

      <View style={themed($spacer)} />

      {/* Auth card */}
      <View style={themed($authCard)}>
        <Text preset="heading" style={themed($authTitle)}>
          Welcome Back
        </Text>

        <View style={themed($form)}>
          <TextField
            value={authEmail}
            onChangeText={setAuthEmail}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            labelTx="loginScreen:emailFieldLabel"
            placeholderTx="loginScreen:emailFieldPlaceholder"
            helper={error}
            status={error ? "error" : undefined}
            onSubmitEditing={() => authPasswordInput.current?.focus()}
          />

          <TextField
            ref={authPasswordInput}
            value={authPassword}
            onChangeText={setAuthPassword}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            labelTx="loginScreen:passwordFieldLabel"
            placeholderTx="loginScreen:passwordFieldPlaceholder"
            onSubmitEditing={login}
            RightAccessory={PasswordRightAccessory}
          />

          <View style={themed($loginButtonWrapper)}>
            <Button
              testID="login-button"
              onPress={login}
              style={themed($loginButton)}
              disabled={isLoading}
              // show loader on right using RightAccessory prop if your Button supports it
              // fallback: if your Button doesn't support RightAccessory, show ActivityIndicator as children
            >
              {isLoading ? <ActivityIndicator color={theme.colors.palette.accent100} /> : <Text tx="loginScreen:logIn" preset="subheading" />}
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={themed($forgotButton)}>
              <Text tx="loginScreen:forgotPassword" style={themed($forgotText)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Divider with label */}
      <View style={themed($dividerRow)}>
        <View style={themed($dividerLine)} />
        <Text style={themed($dividerText)}>or continue with</Text>
        <View style={themed($dividerLine)} />
      </View>

      {/* Social login */}
      <TouchableOpacity style={themed($socialButton)} onPress={signInWithGoogle} disabled={isGoogleLoading}>
        <PressableIcon icon="google" size={20} color={theme.colors.palette.neutral800} containerStyle={themed($socialIcon)} />
        {isGoogleLoading ? (
          <ActivityIndicator style={themed($socialLoader)} />
        ) : (
          <Text style={themed($socialText)}>Continue with Google</Text>
        )}
      </TouchableOpacity>

      {/* Sign up row */}
      <View style={themed($signupRow)}>
        <Text tx="loginScreen:noAccount" style={themed($noAccount)} />
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text tx="loginScreen:signUp" style={themed($signUp)} />
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

const $logoBox = ({ colors }: any) =>
  ({
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.palette.appPrimary,
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
    shadowColor: "#c4adadff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
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

const $loginButtonWrapper = ({ spacing }: any) =>
  ({
    marginTop: spacing.sm,
  } as ViewStyle)

const $loginButton = ({ colors }: any) =>
  ({
    borderRadius: 25,
    backgroundColor: colors.palette.appPrimary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  } as ViewStyle)

const $forgotButton = ({ spacing }: any) =>
  ({
    marginTop: spacing.sm,
    alignSelf: "center",
  } as ViewStyle)

const $forgotText = ({ colors }: any) =>
  ({
    color: colors.palette.appPrimary,
    fontWeight: "500",
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

const $signupRow = ({ spacing }: any) =>
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

const $signUp = ({ colors }: any) =>
  ({
    color: colors.palette.appPrimary,
    fontWeight: "600",
  } as TextStyle)

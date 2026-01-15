import React, { FC, useRef, useState } from "react"
import {
  TextInput,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { supabase } from "@/services/supabase/supabase"

interface ForgotPasswordProps extends AppStackScreenProps<"ForgotPassword"> { }

export const ForgotPasswordScreen: FC<ForgotPasswordProps> = ({ navigation }) => {
  const emailRef = useRef<TextInput>(null)
  const { themed, theme } = useAppTheme()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emailError =
    isSubmitted && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())
      ? "Please enter a valid email address"
      : ""

  async function onSendResetEmail() {
    Keyboard.dismiss()
    setIsSubmitted(true)

    if (emailError) return

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'cookingbuddy://reset-password', // Deep link for mobile app
      })

      if (error) {
        Alert.alert("Reset Failed", error.message)
        return
      }

      Alert.alert(
        "Check Your Email 📧",
        "We've sent you a password reset link. Please check your email and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    } catch (err) {
      Alert.alert("Reset Failed", String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContent)}
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

      {/* Icon */}
      <View style={themed($iconContainer)}>
        <View style={themed($iconBox)}>
          <PressableIcon icon="lock" size={48} color="#fff" />
        </View>
      </View>

      {/* Title */}
      <View style={themed($titleContainer)}>
        <Text preset="heading" style={themed($title)}>
          Forgot Password?
        </Text>
        <Text style={themed($subtitle)}>
          No worries! Enter your email and we'll send you a reset link
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
          onSubmitEditing={onSendResetEmail}
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

        <Button
          testID="send-reset-button"
          onPress={onSendResetEmail}
          disabled={isLoading}
          style={themed($sendButton)}
          pressedStyle={themed($sendButtonPressed)}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={themed($sendButtonText)}>Send Reset Link</Text>
          )}
        </Button>
      </View>

      {/* Back to login */}
      <View style={themed($bottomRow)}>
        <Text style={themed($rememberText)}>Remember your password? </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={themed($backToLogin)}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

/* Styles */
const $screenContent = ({ spacing }: any) =>
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

const $iconContainer = ({ spacing }: any) =>
({
  alignItems: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.xl,
} as ViewStyle)

const $iconBox = ({ colors, spacing }: any) =>
({
  width: 100,
  height: 100,
  borderRadius: 24,
  backgroundColor: colors.palette.appPrimary,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: colors.palette.appPrimary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8,
} as ViewStyle)

const $titleContainer = ({ spacing }: any) =>
({
  alignItems: "center",
  marginBottom: spacing.xl,
  paddingHorizontal: spacing.md,
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
  lineHeight: 24,
} as TextStyle)

const $form = ({ spacing }: any) =>
({
  width: "100%",
  marginBottom: spacing.lg,
} as ViewStyle)

const $textField = ({ spacing }: any) =>
({
  marginBottom: spacing.xl,
} as ViewStyle)

const $sendButton = ({ colors, spacing }: any) =>
({
  borderRadius: 16,
  backgroundColor: colors.palette.appPrimary,
  paddingVertical: 16,
  shadowColor: colors.palette.appPrimary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
} as ViewStyle)

const $sendButtonPressed = ({ colors }: any) =>
({
  backgroundColor: colors.palette.appPrimary,
  opacity: 0.8,
} as ViewStyle)

const $sendButtonText = ({ }: any) =>
({
  fontSize: 18,
  fontWeight: "600",
  color: "#fff",
} as TextStyle)

const $bottomRow = ({ spacing }: any) =>
({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.xl,
} as ViewStyle)

const $rememberText = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.neutral600,
} as TextStyle)

const $backToLogin = ({ colors }: any) =>
({
  fontSize: 15,
  color: colors.palette.appPrimary,
  fontWeight: "700",
} as TextStyle)

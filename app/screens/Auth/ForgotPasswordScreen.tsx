import React, { FC, useRef, useState } from "react"
import { TextInput, View, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator, Alert } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import type { ThemedStyle } from "@/theme/types"

interface ForgotPasswordProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordProps> = ({ navigation }) => {
  const emailRef = useRef<TextInput>(null)
  const { themed, theme } = useAppTheme()
  const auth = useAuth() // may or may not include sendPasswordResetEmail

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emailError =
    isSubmitted && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim()) ? "Please enter a valid email" : ""

  async function onSendResetEmail() {
    setIsSubmitted(true)
    if (emailError) return

    setIsLoading(true)
    try {
      // If your auth context exposes a real function, use it:
      if (typeof auth?.sendPasswordResetEmail === "function") {
        const result = await auth.sendPasswordResetEmail(email)
        // expect result to have isSuccess / error similar to your Flutter service
        if (result?.isSuccess) {
          navigation.replace("ResetPasswordSuccess", { email })
        } else {
          Alert.alert("Failed", result?.error ?? "Failed to send reset email")
        }
      } else {
        // Fallback/mock — replace with your real API call
        await new Promise((res) => setTimeout(res, 900))
        // simulate success:
        navigation.replace("ResetPasswordSuccess", { email })
      }
    } catch (err) {
      Alert.alert("Failed", String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContent)} safeAreaEdges={["top", "bottom"]}>
      {/* AppBar back */}
      <View style={themed($appBar)}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={themed($backButton)}>
          <PressableIcon icon="caretLeft" size={24} color={theme.colors.palette.neutral800} />
        </TouchableOpacity>
        <Text style={themed($appBarTitle)}>Reset Password</Text>
      </View>

      {/* Icon box */}
      <View style={themed($iconBox)}>
        <PressableIcon icon="lock" size={40} color={theme.colors.palette.appPrimary} />
      </View>

      <View style={themed($spacer)} />

      {/* Card-like container */}
      <View style={themed($authCard)}>
        <Text style={themed($cardTitle)}>Forgot Password?</Text>

        <Text style={themed($cardBody)}>
          Don't worry! Enter your email address and we'll send you a link to reset your password.
        </Text>

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
            placeholder="Enter your email"
            helper={emailError}
            status={emailError ? "error" : undefined}
            onSubmitEditing={onSendResetEmail}
            LeftAccessory={() => <PressableIcon icon="github" size={18} color={theme.colors.palette.neutral600} />}
          />

          <View style={themed($sendButtonWrapper)}>
            <Button
              testID="send-reset-button"
              onPress={onSendResetEmail}
              disabled={isLoading}
              style={themed($sendButton)}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.palette.accent100} />
              ) : (
                <Text style={themed($sendButtonText)}>Send Reset Link</Text>
              )}
            </Button>
          </View>
        </View>
      </View>

      {/* Back to login */}
      <View style={themed($bottomRow)}>
        <Text style={themed($rememberText)}>Remember your password?</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed($backToLogin)}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

/* Styles */
const $screenContent: ThemedStyle<ViewStyle> = ({ spacing }: any) =>
  ({
    padding: spacing.lg,
    alignItems: "center",
  } as ViewStyle)

const $appBar = ({ spacing }: any) =>
  ({
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  } as ViewStyle)

const $backButton = ({ spacing }: any) =>
  ({
    padding: spacing.xs,
    marginLeft: -8,
  } as ViewStyle)

const $appBarTitle = ({ spacing }: any) =>
  ({
    marginLeft: spacing.md,
    fontWeight: "600",
  } as TextStyle)

const $iconBox = ({ colors }: any) =>
  ({
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.palette.appPrimary + "10", // subtle tint; adjust if your theme helper differs
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

const $cardTitle = ({ spacing }: any) =>
  ({
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
  } as TextStyle)

const $cardBody = ({ spacing, colors }: any) =>
  ({
    color: colors.palette.neutral600,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  } as TextStyle)

const $form = ({}: any) =>
  ({
    width: "100%",
  } as ViewStyle)

const $textField = ({ spacing }: any) =>
  ({
    marginBottom: spacing.md,
  } as ViewStyle)

const $sendButtonWrapper = ({ spacing }: any) =>
  ({
    marginTop: spacing.sm,
  } as ViewStyle)

const $sendButton = ({ colors }: any) =>
  ({
    backgroundColor: colors.palette.appPrimary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle)

const $sendButtonText = ({}: any) =>
  ({
    fontSize: 16,
    fontWeight: "600",
    color: undefined,
  } as TextStyle)

const $bottomRow = ({ spacing }: any) =>
  ({
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  } as ViewStyle)

const $rememberText = ({ colors }: any) =>
  ({
    color: colors.palette.neutral600,
    marginRight: 6,
  } as TextStyle)

const $backToLogin = ({ colors }: any) =>
  ({
    color: colors.palette.appPrimary,
    fontWeight: "600",
  } as TextStyle)

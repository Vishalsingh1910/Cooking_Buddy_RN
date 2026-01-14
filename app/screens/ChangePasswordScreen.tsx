import React, { FC, useState } from "react"
import {
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"

interface ChangePasswordScreenProps extends AppStackScreenProps<"ChangePassword"> { }

export const ChangePasswordScreen: FC<ChangePasswordScreenProps> = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChanging, setIsChanging] = useState(false)

    const validatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields")
            return false
        }

        if (newPassword.length < 8) {
            Alert.alert("Error", "New password must be at least 8 characters")
            return false
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match")
            return false
        }

        if (currentPassword === newPassword) {
            Alert.alert("Error", "New password must be different from current password")
            return false
        }

        return true
    }

    const handleChangePassword = async () => {
        if (!validatePassword()) return

        setIsChanging(true)

        // TODO: Implement password change with Supabase
        // const { error } = await supabase.auth.updateUser({
        //   password: newPassword
        // })

        setTimeout(() => {
            setIsChanging(false)
            Alert.alert(
                "Success",
                "Password changed successfully!",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            )
        }, 1000)
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
                    <Icon icon="back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={$headerTitle}>Change Password</Text>
                <View style={$placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={$content}>
                    {/* Info Card */}
                    <View style={$infoCard}>
                        <Icon icon="lock" size={20} color={colors.palette.appPrimary} />
                        <Text style={$infoText}>
                            Choose a strong password with at least 8 characters, including letters, numbers, and symbols.
                        </Text>
                    </View>

                    {/* Current Password */}
                    <View style={$inputGroup}>
                        <Text style={$label}>Current Password</Text>
                        <View style={$passwordInputContainer}>
                            <TextInput
                                style={$passwordInput}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor={colors.textDim}
                                secureTextEntry={!showCurrentPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={$eyeButton}
                            >
                                <Icon
                                    icon={showCurrentPassword ? "view" : "hidden"}
                                    size={20}
                                    color={colors.textDim}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={$inputGroup}>
                        <Text style={$label}>New Password</Text>
                        <View style={$passwordInputContainer}>
                            <TextInput
                                style={$passwordInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor={colors.textDim}
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={$eyeButton}
                            >
                                <Icon
                                    icon={showNewPassword ? "view" : "hidden"}
                                    size={20}
                                    color={colors.textDim}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={$helperText}>Minimum 8 characters</Text>
                    </View>

                    {/* Confirm Password */}
                    <View style={$inputGroup}>
                        <Text style={$label}>Confirm New Password</Text>
                        <View style={$passwordInputContainer}>
                            <TextInput
                                style={$passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Re-enter new password"
                                placeholderTextColor={colors.textDim}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={$eyeButton}
                            >
                                <Icon
                                    icon={showConfirmPassword ? "view" : "hidden"}
                                    size={20}
                                    color={colors.textDim}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Change Password Button */}
                    <TouchableOpacity
                        style={[$changeButton, isChanging && $changeButtonDisabled]}
                        onPress={handleChangePassword}
                        disabled={isChanging}
                    >
                        <Text style={$changeButtonText}>
                            {isChanging ? "Changing Password..." : "Change Password"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Screen>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
}

const $backButton: ViewStyle = {
    width: 40,
}

const $headerTitle: TextStyle = {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    color: colors.text,
}

const $placeholder: ViewStyle = {
    width: 40,
}

const $content: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
}

const $infoCard: ViewStyle = {
    flexDirection: "row",
    backgroundColor: colors.palette.primary100,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
}

const $infoText: TextStyle = {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
}

const $inputGroup: ViewStyle = {
    marginBottom: spacing.lg,
}

const $label: TextStyle = {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
}

const $passwordInputContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
}

const $passwordInput: TextStyle = {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
}

const $eyeButton: ViewStyle = {
    padding: spacing.md,
}

const $helperText: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    marginTop: spacing.xs,
}

const $changeButton: ViewStyle = {
    backgroundColor: colors.palette.appPrimary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: spacing.md,
}

const $changeButtonDisabled: ViewStyle = {
    opacity: 0.6,
}

const $changeButtonText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "600",
}

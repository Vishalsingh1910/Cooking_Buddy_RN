import React, { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, ScrollView, Alert, Linking } from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"
import { useAuth } from "@/context/AuthContext"

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> { }

export const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
    const { logout } = useAuth()

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout,
                },
            ]
        )
    }

    const handlePrivacyPolicy = () => {
        // Open privacy policy URL or navigate to privacy policy screen
        Linking.openURL("https://your-app-website.com/privacy-policy")
    }

    const handleTermsOfService = () => {
        // Open terms of service URL or navigate to terms screen
        Linking.openURL("https://your-app-website.com/terms-of-service")
    }

    const handleAbout = () => {
        Alert.alert(
            "About Cooking Buddy",
            "Version 1.0.0\n\nYour personal cooking companion for discovering and sharing amazing recipes!",
            [{ text: "OK" }]
        )
    }

    const handleHelp = () => {
        // Navigate to help/FAQ screen or open help URL
        Alert.alert(
            "Help & Support",
            "Need help? Contact us at support@cookingbuddy.com",
            [{ text: "OK" }]
        )
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
                    <Icon icon="back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={$headerTitle}>Settings</Text>
                <View style={$placeholder} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <View style={$section}>
                    <Text style={$sectionTitle}>Account</Text>
                    <SettingsItem
                        icon="person"
                        title="Edit Profile"
                        onPress={() => navigation.navigate("EditProfile")}
                    />
                    <SettingsItem
                        icon="lock"
                        title="Change Password"
                        onPress={() => navigation.navigate("ChangePassword")}
                    />
                </View>

                {/* Preferences Section */}
                <View style={$section}>
                    <Text style={$sectionTitle}>Preferences</Text>
                    {/* Theme option - commented out for future use
                    <SettingsItem
                        icon="view"
                        title="Theme"
                        onPress={() => navigation.navigate("ThemePreferences")}
                    />
                    */}
                    <SettingsItem
                        icon="bell"
                        title="Notifications"
                        onPress={() => navigation.navigate("Notifications")}
                    />
                </View>

                {/* Support Section */}
                <View style={$section}>
                    <Text style={$sectionTitle}>Support</Text>
                    <SettingsItem
                        icon="help"
                        title="Help & FAQ"
                        onPress={handleHelp}
                    />
                    <SettingsItem
                        icon="menu"
                        title="Privacy Policy"
                        onPress={handlePrivacyPolicy}
                    />
                    <SettingsItem
                        icon="menu"
                        title="Terms of Service"
                        onPress={handleTermsOfService}
                    />
                </View>

                {/* About Section */}
                <View style={$section}>
                    <Text style={$sectionTitle}>About</Text>
                    <SettingsItem
                        icon="menu"
                        title="About Cooking Buddy"
                        onPress={handleAbout}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={$logoutButton} onPress={handleLogout}>
                    <Icon icon="x" size={20} color={colors.error} />
                    <Text style={$logoutButtonText}>Logout</Text>
                </TouchableOpacity>

                <View style={$bottomSpacer} />
            </ScrollView>
        </Screen>
    )
}

interface SettingsItemProps {
    icon: string
    title: string
    onPress: () => void
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, onPress }) => (
    <TouchableOpacity style={$settingsItem} onPress={onPress}>
        <View style={$settingsItemLeft}>
            <Icon icon={icon as any} size={20} color={colors.textDim} />
            <Text style={$settingsItemText}>{title}</Text>
        </View>
        <Icon icon="caretRight" size={16} color={colors.textDim} />
    </TouchableOpacity>
)

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
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

const $section: ViewStyle = {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
}

const $sectionTitle: TextStyle = {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    color: colors.textDim,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
}

const $settingsItem: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
}

const $settingsItemLeft: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
}

const $settingsItemText: TextStyle = {
    fontSize: 16,
    color: colors.text,
}

const $logoutButton: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.palette.neutral100,
}

const $logoutButtonText: TextStyle = {
    color: colors.error,
    fontSize: 16,
    fontWeight: "600",
}

const $bottomSpacer: ViewStyle = {
    height: spacing.xl,
}

import React, { FC, useState } from "react"
import {
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    ScrollView,
    Switch,
} from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"

interface NotificationsScreenProps extends AppStackScreenProps<"Notifications"> { }

export const NotificationsScreen: FC<NotificationsScreenProps> = ({ navigation }) => {
    // Notification preferences state
    const [pushNotifications, setPushNotifications] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)

    // Recipe notifications
    const [newRecipes, setNewRecipes] = useState(true)
    const [recipeComments, setRecipeComments] = useState(true)
    const [recipeLikes, setRecipeLikes] = useState(false)

    // Social notifications
    const [newFollowers, setNewFollowers] = useState(true)
    const [mentions, setMentions] = useState(true)
    const [messages, setMessages] = useState(true)

    // System notifications
    const [updates, setUpdates] = useState(false)
    const [tips, setTips] = useState(true)

    const handleSave = () => {
        // TODO: Save notification preferences to backend/AsyncStorage
        console.log("Saving notification preferences...")
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
                    <Icon icon="back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={$headerTitle}>Notifications</Text>
                <View style={$placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* General Settings */}
                <View style={$section}>
                    <Text style={$sectionTitle}>GENERAL</Text>

                    <NotificationItem
                        icon="bell"
                        title="Push Notifications"
                        description="Receive notifications on your device"
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                    />

                    <NotificationItem
                        icon="menu"
                        title="Email Notifications"
                        description="Receive notifications via email"
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                    />
                </View>

                {/* Recipe Notifications */}
                <View style={$section}>
                    <Text style={$sectionTitle}>RECIPES</Text>

                    <NotificationItem
                        icon="restaurant"
                        title="New Recipes"
                        description="From people you follow"
                        value={newRecipes}
                        onValueChange={setNewRecipes}
                        disabled={!pushNotifications}
                    />

                    <NotificationItem
                        icon="chat"
                        title="Comments"
                        description="Someone comments on your recipe"
                        value={recipeComments}
                        onValueChange={setRecipeComments}
                        disabled={!pushNotifications}
                    />

                    <NotificationItem
                        icon="heart"
                        title="Likes"
                        description="Someone likes your recipe"
                        value={recipeLikes}
                        onValueChange={setRecipeLikes}
                        disabled={!pushNotifications}
                    />
                </View>

                {/* Social Notifications */}
                <View style={$section}>
                    <Text style={$sectionTitle}>SOCIAL</Text>

                    <NotificationItem
                        icon="person"
                        title="New Followers"
                        description="Someone follows you"
                        value={newFollowers}
                        onValueChange={setNewFollowers}
                        disabled={!pushNotifications}
                    />

                    <NotificationItem
                        icon="chat"
                        title="Mentions"
                        description="Someone mentions you"
                        value={mentions}
                        onValueChange={setMentions}
                        disabled={!pushNotifications}
                    />

                    <NotificationItem
                        icon="chat"
                        title="Messages"
                        description="New chat messages"
                        value={messages}
                        onValueChange={setMessages}
                        disabled={!pushNotifications}
                    />
                </View>

                {/* System Notifications */}
                <View style={$section}>
                    <Text style={$sectionTitle}>SYSTEM</Text>

                    <NotificationItem
                        icon="menu"
                        title="App Updates"
                        description="New features and improvements"
                        value={updates}
                        onValueChange={setUpdates}
                        disabled={!pushNotifications}
                    />

                    <NotificationItem
                        icon="star"
                        title="Cooking Tips"
                        description="Weekly cooking tips and tricks"
                        value={tips}
                        onValueChange={setTips}
                        disabled={!pushNotifications}
                    />
                </View>

                <View style={$bottomSpacer} />
            </ScrollView>
        </Screen>
    )
}

interface NotificationItemProps {
    icon: string
    title: string
    description: string
    value: boolean
    onValueChange: (value: boolean) => void
    disabled?: boolean
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    icon,
    title,
    description,
    value,
    onValueChange,
    disabled = false,
}) => (
    <View style={[$notificationItem, disabled && $notificationItemDisabled]}>
        <View style={$iconContainer}>
            <Icon icon={icon as any} size={20} color={disabled ? colors.textDim : colors.palette.appPrimary} />
        </View>
        <View style={$notificationContent}>
            <Text style={[$notificationTitle, disabled && $textDisabled]}>{title}</Text>
            <Text style={[$notificationDescription, disabled && $textDisabled]}>{description}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: colors.palette.neutral300, true: colors.palette.appPrimary }}
            thumbColor={colors.palette.neutral100}
        />
    </View>
)

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

const $section: ViewStyle = {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
}

const $sectionTitle: TextStyle = {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    color: colors.textDim,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
}

const $notificationItem: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
}

const $notificationItemDisabled: ViewStyle = {
    opacity: 0.5,
}

const $iconContainer: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.palette.primary100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
}

const $notificationContent: ViewStyle = {
    flex: 1,
}

const $notificationTitle: TextStyle = {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
}

const $notificationDescription: TextStyle = {
    fontSize: 13,
    color: colors.textDim,
}

const $textDisabled: TextStyle = {
    color: colors.textDim,
}

const $bottomSpacer: ViewStyle = {
    height: spacing.xl,
}

import React, { FC } from "react"
import {
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    ScrollView,
} from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"
import { useAppTheme } from "@/theme/context"
import { storage } from "@/utils/storage"

interface ThemePreferencesScreenProps extends AppStackScreenProps<"ThemePreferences"> { }

type ThemeOption = "light" | "dark" | "system"

export const ThemePreferencesScreen: FC<ThemePreferencesScreenProps> = ({ navigation }) => {
    const { themeContext, setThemeContextOverride } = useAppTheme()

    // Get the current theme preference from storage
    // If themeContext matches system, it means no override is set
    const getCurrentTheme = (): ThemeOption => {
        // Check if there's a stored preference
        const storedTheme = storage.getString("ignite.themeScheme")
        if (storedTheme === "dark") return "dark"
        if (storedTheme === "light") return "light"
        return "system"
    }

    const [selectedTheme, setSelectedTheme] = React.useState<ThemeOption>(getCurrentTheme())

    const handleThemeChange = (theme: ThemeOption) => {
        setSelectedTheme(theme)

        if (theme === "system") {
            // Clear the override to follow system theme
            setThemeContextOverride(undefined)
        } else {
            // Set specific theme
            setThemeContextOverride(theme)
        }
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
                    <Icon icon="back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={$headerTitle}>Theme</Text>
                <View style={$placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={$content}>
                    {/* Info Text */}
                    <Text style={$infoText}>
                        Choose how Cooking Buddy looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
                    </Text>

                    {/* Theme Options */}
                    <View style={$optionsContainer}>
                        <ThemeOption
                            title="Light"
                            description="Always use light theme"
                            icon="view"
                            selected={selectedTheme === "light"}
                            onPress={() => handleThemeChange("light")}
                        />

                        <ThemeOption
                            title="Dark"
                            description="Always use dark theme"
                            icon="hidden"
                            selected={selectedTheme === "dark"}
                            onPress={() => handleThemeChange("dark")}
                        />

                        <ThemeOption
                            title="System Default"
                            description="Sync with system settings"
                            icon="settings"
                            selected={selectedTheme === "system"}
                            onPress={() => handleThemeChange("system")}
                        />
                    </View>

                    {/* Current Theme Display */}
                    <View style={$currentThemeCard}>
                        <Text style={$currentThemeLabel}>Current Theme</Text>
                        <Text style={$currentThemeValue}>
                            {themeContext === "dark" ? "Dark" : "Light"}
                        </Text>
                        {selectedTheme === "system" && (
                            <Text style={$currentThemeHint}>
                                Following system preference
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )
}

interface ThemeOptionProps {
    title: string
    description: string
    icon: string
    selected: boolean
    onPress: () => void
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
    title,
    description,
    icon,
    selected,
    onPress,
}) => (
    <TouchableOpacity
        style={[$themeOption, selected && $themeOptionSelected]}
        onPress={onPress}
    >
        <View style={$themeOptionLeft}>
            <View style={[$iconContainer, selected && $iconContainerSelected]}>
                <Icon
                    icon={icon as any}
                    size={24}
                    color={selected ? colors.palette.appPrimary : colors.textDim}
                />
            </View>
            <View style={$themeOptionText}>
                <Text style={[$themeOptionTitle, selected && $themeOptionTitleSelected]}>
                    {title}
                </Text>
                <Text style={$themeOptionDescription}>{description}</Text>
            </View>
        </View>
        {selected && (
            <View style={$checkmark}>
                <Icon icon="check" size={20} color={colors.palette.appPrimary} />
            </View>
        )}
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

const $infoText: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 20,
    marginBottom: spacing.lg,
}

const $optionsContainer: ViewStyle = {
    gap: spacing.sm,
}

const $themeOption: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.palette.neutral100,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
}

const $themeOptionSelected: ViewStyle = {
    borderColor: colors.palette.appPrimary,
    backgroundColor: colors.palette.primary100,
}

const $themeOptionLeft: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
}

const $iconContainer: ViewStyle = {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.palette.neutral200,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
}

const $iconContainerSelected: ViewStyle = {
    backgroundColor: colors.palette.primary100,
}

const $themeOptionText: ViewStyle = {
    flex: 1,
}

const $themeOptionTitle: TextStyle = {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
}

const $themeOptionTitleSelected: TextStyle = {
    color: colors.palette.appPrimary,
}

const $themeOptionDescription: TextStyle = {
    fontSize: 13,
    color: colors.textDim,
}

const $checkmark: ViewStyle = {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.palette.primary100,
    alignItems: "center",
    justifyContent: "center",
}

const $currentThemeCard: ViewStyle = {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.palette.neutral100,
    borderRadius: 12,
    alignItems: "center",
}

const $currentThemeLabel: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.xs,
}

const $currentThemeValue: TextStyle = {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.palette.appPrimary,
}

const $currentThemeHint: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    marginTop: spacing.xs,
}

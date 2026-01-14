import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Dimensions } from "react-native"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { colors, spacing } from "@/theme"

const { width } = Dimensions.get("window")
const ITEM_WIDTH = (width - spacing.md * 2 - spacing.sm * 2) / 3

interface Achievement {
    title: string
    description: string
    icon: string
    color: string
    earned: boolean
}

export const AchievementBadges: React.FC = () => {
    const achievements: Achievement[] = [
        {
            title: "First Recipe",
            description: "Posted your first recipe",
            icon: "restaurant",
            color: colors.palette.secondary,
            earned: true,
        },
        {
            title: "Popular Chef",
            description: "100+ recipe likes",
            icon: "heart",
            color: "#E91E63",
            earned: true,
        },
        {
            title: "Community Helper",
            description: "Helped 50+ people",
            icon: "help",
            color: colors.palette.secondary500,
            earned: true,
        },
        {
            title: "Master Chef",
            description: "50+ recipes shared",
            icon: "star",
            color: colors.palette.angry500,
            earned: false,
        },
        {
            title: "Social Butterfly",
            description: "1000+ followers",
            icon: "people",
            color: colors.palette.appPrimary,
            earned: false,
        },
        {
            title: "Recipe Collector",
            description: "Saved 100+ recipes",
            icon: "bookmark",
            color: "#FF9800",
            earned: true,
        },
    ]

    return (
        <View style={$container}>
            {achievements.map((achievement, index) => (
                <AchievementBadge key={index} achievement={achievement} />
            ))}
        </View>
    )
}

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { title, description, icon, color, earned } = achievement

    return (
        <TouchableOpacity
            style={[
                $badge,
                {
                    backgroundColor: earned ? `${color}20` : colors.palette.neutral100,
                    borderColor: earned ? `${color}50` : colors.palette.neutral300,
                },
            ]}
        >
            <View style={[$iconContainer, { backgroundColor: earned ? color : colors.palette.neutral400 }]}>
                <Icon icon={icon as any} size={24} color={colors.palette.neutral100} />
            </View>
            <Text
                style={[$title, { color: earned ? colors.text : colors.palette.neutral400 }]}
                numberOfLines={2}
            >
                {title}
            </Text>
            <Text
                style={[$description, { color: earned ? colors.textDim : colors.palette.neutral400 }]}
                numberOfLines={2}
            >
                {description}
            </Text>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
}

const $badge: ViewStyle = {
    width: ITEM_WIDTH,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
}

const $iconContainer: ViewStyle = {
    padding: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.xs,
}

const $title: TextStyle = {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 2,
}

const $description: TextStyle = {
    fontSize: 10,
    textAlign: "center",
}

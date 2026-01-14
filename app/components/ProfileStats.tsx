import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { colors, spacing } from "@/theme"

interface ProfileStatsProps {
    recipesShared: number
    followers: number
    following: number
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
    recipesShared,
    followers,
    following,
}) => {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    return (
        <View style={$container}>
            <StatItem
                label="Recipes Shared"
                value={recipesShared.toString()}
                icon="restaurant"
                color={colors.palette.appPrimary}
            />
            <View style={$divider} />
            <StatItem
                label="Followers"
                value={formatNumber(followers)}
                icon="people"
                color={colors.palette.secondary500}
            />
            <View style={$divider} />
            <StatItem
                label="Following"
                value={formatNumber(following)}
                icon="person-add"
                color={colors.palette.angry500}
            />
        </View>
    )
}

interface StatItemProps {
    label: string
    value: string
    icon: string
    color: string
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color }) => (
    <TouchableOpacity style={$statItem}>
        <View style={[$iconContainer, { backgroundColor: `${color}20` }]}>
            <Icon icon={icon as any} size={24} color={color} />
        </View>
        <Text style={$value}>{value}</Text>
        <Text style={$label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
)

const $container: ViewStyle = {
    flexDirection: "row",
    backgroundColor: colors.palette.neutral100,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
}

const $statItem: ViewStyle = {
    flex: 1,
    alignItems: "center",
}

const $iconContainer: ViewStyle = {
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
}

const $value: TextStyle = {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.xs,
}

const $label: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    textAlign: "center",
}

const $divider: ViewStyle = {
    width: 1,
    backgroundColor: colors.palette.neutral200,
    marginHorizontal: spacing.xs,
}

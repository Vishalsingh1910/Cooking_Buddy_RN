import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { colors, spacing } from "@/theme"

export const CuisineTags: React.FC = () => {
    const cuisines = [
        { name: "Mediterranean", color: colors.palette.appPrimary },
        { name: "Asian", color: colors.palette.secondary500 },
        { name: "Italian", color: colors.palette.angry500 },
        { name: "Mexican", color: colors.palette.secondary },
        { name: "Indian", color: "#E91E63" },
        { name: "French", color: colors.palette.primary400 },
    ]

    return (
        <View style={$container}>
            {cuisines.map((cuisine, index) => (
                <View key={index} style={[$tag, { backgroundColor: `${cuisine.color}20`, borderColor: `${cuisine.color}50` }]}>
                    <View style={[$dot, { backgroundColor: cuisine.color }]} />
                    <Text style={[$tagText, { color: cuisine.color }]}>{cuisine.name}</Text>
                </View>
            ))}
        </View>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
}

const $tag: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
}

const $dot: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
}

const $tagText: TextStyle = {
    fontSize: 14,
    fontWeight: "500",
}

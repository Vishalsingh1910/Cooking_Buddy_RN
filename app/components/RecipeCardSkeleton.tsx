import React from "react"
import { View, ViewStyle } from "react-native"
import { Skeleton } from "./Skeleton"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"

export function RecipeCardSkeleton() {
    return (
        <View style={$container}>
            {/* Image Skeleton */}
            <Skeleton width="100%" height={200} borderRadius={0} />

            {/* Content Skeleton */}
            <View style={$content}>
                {/* Title */}
                <Skeleton width="80%" height={24} style={{ marginBottom: spacing.sm }} />

                {/* Meta Row */}
                <View style={$metaRow}>
                    <Skeleton width={60} height={16} borderRadius={4} />
                    <Skeleton width={80} height={16} borderRadius={4} />
                    <Skeleton width={70} height={16} borderRadius={4} />
                </View>

                {/* Footer / Author */}
                <View style={$footer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Skeleton width={24} height={24} borderRadius={12} />
                        <Skeleton width={100} height={14} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const $container: ViewStyle = {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 20,
    marginBottom: spacing.sm,
    shadowColor: colors.palette.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
}

const $content: ViewStyle = {
    padding: spacing.md,
}

const $metaRow: ViewStyle = {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
}

const $footer: ViewStyle = {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.palette.neutral200,
    marginTop: spacing.xs,
}

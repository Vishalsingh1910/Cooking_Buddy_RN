/**
 * A card component that displays a recipe's image, title, and key details.
 */
import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Image, TouchableOpacity, ImageStyle } from "react-native"
import { Text } from "./Text"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"
import { Recipe } from "../models/Recipe"
import { Icon } from "./Icon"

export interface RecipeCardProps {
    /**
     * The recipe data to display
     */
    recipe: Recipe
    /**
     * An optional style override useful for padding & margin.
     */
    style?: StyleProp<ViewStyle>
    /**
     * Press handler for card
     */
    onPress?: (recipe: Recipe) => void
    /**
     * Like button handler
     */
    onLike?: (recipe: Recipe) => void
    /**
     * Save/bookmark button handler
     */
    onSave?: (recipe: Recipe) => void
    /**
     * Share button handler
     */
    onShare?: (recipe: Recipe) => void
}

/**
 * A card component that displays a recipe's image, title, and key details.
 */
export function RecipeCard(props: RecipeCardProps) {
    const { recipe, style, onPress, onLike, onSave, onShare } = props

    const handleLike = (e: any) => {
        e?.stopPropagation?.()
        onLike?.(recipe)
    }

    const handleSave = (e: any) => {
        e?.stopPropagation?.()
        onSave?.(recipe)
    }

    const handleShare = (e: any) => {
        e?.stopPropagation?.()
        onShare?.(recipe)
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[$container, style]}
            onPress={() => onPress?.(recipe)}
        >
            {/* Image & Badges */}
            <View>
                <Image source={{ uri: recipe.imageUrl }} style={$image} />
                <View style={$badgeContainer}>
                    <View style={$badge}>
                        <Icon icon="star" size={10} color={colors.palette.neutral100} />
                        <Text style={$badgeText} size="xs">{recipe.rating.toFixed(1)}</Text>
                    </View>
                </View>
                <TouchableOpacity style={$bookmarkContainer} onPress={handleSave}>
                    <Icon
                        icon={recipe.isSaved ? "bookmark" : "bookmarkOutline"}
                        size={20}
                        color={recipe.isSaved ? colors.palette.primary500 : colors.palette.neutral100}
                    />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={$content}>
                <View style={$headerRow}>
                    <Text style={$title} numberOfLines={2}>{recipe.title}</Text>
                </View>

                {/* Description/Caption */}
                <Text style={$description} numberOfLines={2}>
                    {recipe.description || "A delicious recipe that you'll love to make and share with family and friends!"}
                </Text>

                {/* Meta Info */}
                <View style={$metaRow}>
                    <View style={$metaItem}>
                        <Icon icon="clock" size={14} color={colors.palette.primary500} />
                        <Text style={$metaText}>{recipe.cookingTimeMinutes} min</Text>
                    </View>
                    <View style={[$metaItem, { marginLeft: spacing.md }]}>
                        <Icon icon="components" size={14} color={colors.palette.primary500} />
                        <Text style={$metaText}>{recipe.difficulty || "Medium"}</Text>
                    </View>
                    {recipe.calories && (
                        <View style={[$metaItem, { marginLeft: spacing.md }]}>
                            <Text style={$metaText}>🔥 {recipe.calories} kcal</Text>
                        </View>
                    )}
                </View>

                {/* Footer: Author & Social Actions */}
                <View style={$footer}>
                    <View style={$authorContainer}>
                        <Image
                            source={{ uri: recipe.authorImageUrl || "https://i.pravatar.cc/150?img=12" }}
                            style={$authorAvatar}
                        />
                        <Text style={$author} numberOfLines={1}>By {recipe.authorName}</Text>
                    </View>

                    {/* Social Actions */}
                    <View style={$socialActions}>
                        <TouchableOpacity style={$actionButton} onPress={handleLike}>
                            <Icon
                                icon={recipe.isLiked ? "heart" : "heartOutline"}
                                size={18}
                                color={recipe.isLiked ? colors.palette.angry500 : colors.palette.primary500}
                            />
                            <Text style={$actionText}>{recipe.likesCount || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={$actionButton} onPress={handleShare}>
                            <Icon icon="share" size={18} color={colors.palette.primary500} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 20,
    marginBottom: spacing.md,
    shadowColor: colors.palette.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
}

const $image: ImageStyle = {
    width: "100%",
    height: 200,
    resizeMode: "cover",
}

const $badgeContainer: ViewStyle = {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
}

const $badge: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
}

const $badgeText: TextStyle = {
    color: colors.palette.neutral100,
    fontWeight: "bold",
}

const $bookmarkContainer: ViewStyle = {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
}

const $content: ViewStyle = {
    padding: spacing.sm,
}

const $headerRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xxs,
}

const $title: TextStyle = {
    fontFamily: typography.primary.bold,
    fontSize: 18,
    color: colors.text,
    lineHeight: 24,
    flex: 1,
}

const $description: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 20,
    marginBottom: spacing.xs,
}

const $metaRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: 0,
}

const $metaItem: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
}

const $metaText: TextStyle = {
    fontSize: 13,
    color: colors.textDim,
    fontWeight: "500",
}

const $footer: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.palette.neutral200,
    marginTop: 0,
}

const $authorContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
}

const $authorAvatar: ImageStyle = {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.palette.neutral300,
}

const $author: TextStyle = {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
    flex: 1,
}

const $socialActions: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
}

const $actionButton: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    padding: 2,
}

const $actionText: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: "600",
}

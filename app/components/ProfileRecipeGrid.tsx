import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle, Dimensions, StyleSheet } from "react-native"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { colors, spacing } from "@/theme"
import { Recipe } from "@/models/Recipe"

const { width } = Dimensions.get("window")
const ITEM_WIDTH = (width - spacing.md * 2 - spacing.xs * 2) / 3

interface ProfileRecipeGridProps {
    recipes: Recipe[]
    onRecipePress: (recipe: Recipe) => void
}

export const ProfileRecipeGrid: React.FC<ProfileRecipeGridProps> = ({ recipes, onRecipePress }) => {
    // Show first 9 recipes
    const displayRecipes = recipes.slice(0, 9)

    if (displayRecipes.length === 0) {
        return (
            <View style={$emptyContainer}>
                <Text style={$emptyText}>No recipes yet</Text>
            </View>
        )
    }

    return (
        <View style={$container}>
            {displayRecipes.map((recipe, index) => (
                <RecipeGridItem key={recipe.id} recipe={recipe} onPress={() => onRecipePress(recipe)} />
            ))}
        </View>
    )
}

const RecipeGridItem: React.FC<{ recipe: Recipe; onPress: () => void }> = ({ recipe, onPress }) => {
    return (
        <TouchableOpacity style={$gridItem} onPress={onPress}>
            <Image
                source={{ uri: recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" }}
                style={$image}
            />
            <View style={$overlay}>
                <View style={$content}>
                    <Text style={$recipeTitle} numberOfLines={2}>
                        {recipe.title}
                    </Text>
                    <View style={$likesRow}>
                        <Icon icon="heart" size={12} color={colors.palette.neutral100} />
                        <Text style={$likesText}>{recipe.likesCount || 0}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
}

const $gridItem: ViewStyle = {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 8,
    overflow: "hidden",
}

const $image: ImageStyle = {
    width: "100%",
    height: "100%",
}

const $overlay: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
}

const $content: ViewStyle = {
    padding: spacing.xs,
}

const $recipeTitle: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 2,
}

const $likesRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
}

const $likesText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 10,
}

const $emptyContainer: ViewStyle = {
    padding: spacing.lg,
    alignItems: "center",
}

const $emptyText: TextStyle = {
    color: colors.textDim,
}

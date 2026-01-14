import React, { FC, useEffect, useState } from "react"
import { View, FlatList, ActivityIndicator, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { colors, spacing } from "@/theme"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { RecipeCard } from "@/components/RecipeCard"
import { useAuth } from "@/context/AuthContext"
import { useFocusEffect } from "@react-navigation/native"

interface FavoritesScreenProps extends AppStackScreenProps<"Favorites"> { }

export const FavoritesScreen: FC<FavoritesScreenProps> = ({ navigation }) => {
    const { session } = useAuth()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useFocusEffect(
        React.useCallback(() => {
            fetchSavedRecipes()
        }, [])
    )

    const fetchSavedRecipes = async () => {
        if (!session?.user) return
        setIsLoading(true)
        const data = await RecipeService.getSavedRecipes(session.user.id)
        setRecipes(data)
        setIsLoading(false)
    }

    const handleRecipePress = (recipe: Recipe) => {
        navigation.navigate("RecipeDetail", { id: recipe.id })
    }

    if (isLoading) {
        return (
            <View style={$loadingContainer}>
                <ActivityIndicator size="large" color={colors.palette.appPrimary} />
            </View>
        )
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <Text preset="heading" text="Saved Recipes" style={$title} />
            </View>

            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RecipeCard recipe={item} onPress={handleRecipePress} />
                )}
                contentContainerStyle={$listContent}
                ListEmptyComponent={
                    <View style={$emptyContainer}>
                        <Text text="No saved recipes yet!" style={$emptyText} />
                    </View>
                }
            />
        </Screen>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
}

const $title: TextStyle = {
    marginBottom: spacing.xs,
}

const $listContent: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
}

const $loadingContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}

const $emptyContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
}

const $emptyText: TextStyle = {
    color: colors.textDim,
}

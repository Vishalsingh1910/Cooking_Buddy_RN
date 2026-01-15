import React, { FC, useEffect, useState } from "react"
import {
    Image,
    ImageStyle,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { DemoTabScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { RecipeCard } from "@/components/RecipeCard"
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { IngredientInputSection } from "@/components/IngredientInputSection"
import { AIRecipeService } from "@/services/api/AIRecipeService"

export const HomeScreen: FC<DemoTabScreenProps<"Home">> = ({ navigation }) => {
    const { themed, theme } = useAppTheme()
    const { session, userProfile } = useAuth()
    const user = session?.user

    const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        fetchRecipes()
    }, [])

    const handleGenerateRecipe = async (ingredients: string[]) => {
        setIsGenerating(true)
        try {
            const recipe = await AIRecipeService.generateRecipe(ingredients)
            navigation.navigate("RecipeDetail", { id: recipe.id, recipeData: recipe } as any)
        } catch (e: any) {
            console.error("AI Generation failed", e)
        } finally {
            setIsGenerating(false)
        }
    }

    const fetchRecipes = async () => {
        setIsLoading(true)
        try {
            const data = await RecipeService.getRecipes()

            // "Trending/Best" = Top rated recipes, limited to 2
            const trending = [...data].sort((a, b) => b.rating - a.rating).slice(0, 2)
            setTrendingRecipes(trending)

        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRecipePress = (recipe: Recipe) => {
        navigation.navigate("RecipeDetail", { id: recipe.id })
    }

    const handleLike = async (recipe: Recipe) => {
        console.log("Like tapped - Current state:", { id: recipe.id, isLiked: recipe.isLiked, likesCount: recipe.likesCount })

        // Optimistic update - update UI immediately
        setTrendingRecipes(prev => prev.map(r =>
            r.id === recipe.id
                ? {
                    ...r,
                    isLiked: !r.isLiked,
                    likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1
                }
                : r
        ))

        // Call API in background
        try {
            await RecipeService.toggleLike(recipe.id, recipe.isLiked)
            console.log("Like API call successful")
        } catch (error) {
            console.error("Error toggling like:", error)
            // Revert on error
            setTrendingRecipes(prev => prev.map(r =>
                r.id === recipe.id
                    ? {
                        ...r,
                        isLiked: recipe.isLiked,
                        likesCount: recipe.likesCount
                    }
                    : r
            ))
        }
    }

    const handleSave = async (recipe: Recipe) => {
        // Optimistic update - update UI immediately
        setTrendingRecipes(prev => prev.map(r =>
            r.id === recipe.id
                ? { ...r, isSaved: !r.isSaved }
                : r
        ))

        // Call API in background
        try {
            await RecipeService.toggleSave(recipe.id, recipe.isSaved)
        } catch (error) {
            console.error("Error toggling save:", error)
            // Revert on error
            setTrendingRecipes(prev => prev.map(r =>
                r.id === recipe.id
                    ? { ...r, isSaved: recipe.isSaved }
                    : r
            ))
        }
    }

    // Extract first name from display_name
    const getFirstName = (fullName: string | undefined) => {
        if (!fullName) return "Chef"
        return fullName.split(" ")[0]
    }

    return (
        <Screen
            preset="scroll"
            contentContainerStyle={themed($screenContentContainer)}
            safeAreaEdges={["top"]}
        >
            <View style={themed($headerContainer)}>
                {/* 1. Greeting Section */}
                <View style={themed($profileHeader)}>
                    <View>
                        <Text text={`Hello, ${getFirstName(userProfile?.display_name)}!`} preset="heading" style={themed($greetingText)} />
                        <Text text="What would you like to cook today?" style={themed($subGreetingText)} />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={{ uri: userProfile?.photo_url || "https://i.pravatar.cc/150?img=68" }}
                            style={themed($avatar) as ImageStyle}
                        />
                    </TouchableOpacity>
                </View>

                {/* 2. AI Ingredient Input */}
                <IngredientInputSection
                    onGenerateRecipe={handleGenerateRecipe}
                    isGenerating={isGenerating}
                />

                {/* 3. Best Recipes Section - Vertical Stack */}
                <View style={themed($sectionHeader)}>
                    <Text text="Best Recipes" preset="subheading" />
                </View>

                {isLoading ? (
                    <View style={themed($bestRecipesContainer)}>
                        {[1, 2].map((i) => (
                            <View key={`skeleton-${i}`} style={themed($recipeCardWrapper)}>
                                <RecipeCardSkeleton />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={themed($bestRecipesContainer)}>
                        {trendingRecipes.map((item) => (
                            <View key={`trending-${item.id}`} style={themed($recipeCardWrapper)}>
                                <RecipeCard
                                    recipe={item}
                                    onPress={handleRecipePress}
                                    onLike={handleLike}
                                    onSave={handleSave}
                                    style={{ width: '100%' } as ViewStyle}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </Screen>
    )
}

const $screenContentContainer = ({ colors }: any) => ({
    flexGrow: 1,
    backgroundColor: colors.background,
} as ViewStyle)

const $loader = ({ spacing }: any) => ({
    marginTop: spacing.xl,
} as ViewStyle)

const $headerContainer = ({ spacing }: any) => ({
    paddingBottom: spacing.md,
} as ViewStyle)

const $profileHeader = ({ spacing }: any) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
} as ViewStyle)

const $greetingText = ({ colors }: any) => ({
    color: colors.text,
} as TextStyle)

const $subGreetingText = ({ colors }: any) => ({
    color: colors.textDim,
    fontSize: 14,
} as TextStyle)

const $avatar = ({ colors }: any) => ({
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.palette.neutral300,
} as ImageStyle)

const $sectionHeader = ({ spacing }: any) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
} as ViewStyle)

const $bestRecipesContainer = ({ spacing }: any) => ({
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
} as ViewStyle)

const $recipeCardWrapper = ({ spacing }: any) => ({
    marginBottom: spacing.sm,
} as ViewStyle)

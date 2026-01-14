import React, { FC, useEffect, useState } from "react"
import {
    ActivityIndicator,
    View,
    ViewStyle,
    FlatList,
    TouchableOpacity,
    TextStyle,
    RefreshControl,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { RecipeCard } from "@/components/RecipeCard"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { AppStackScreenProps } from "@/navigators/navigationTypes"

interface MyRecipesScreenProps extends AppStackScreenProps<"MyRecipes"> { }

type TabType = "myPosts" | "saved"

export const MyRecipesScreen: FC<MyRecipesScreenProps> = ({ navigation }) => {
    const { themed, theme } = useAppTheme()
    const { session } = useAuth()
    const userId = session?.user?.id

    const [activeTab, setActiveTab] = useState<TabType>("myPosts")
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        fetchRecipes()
    }, [activeTab])

    const fetchRecipes = async () => {
        if (!userId) return

        setIsLoading(true)
        try {
            if (activeTab === "myPosts") {
                const data = await RecipeService.getUserRecipes(userId)
                setMyRecipes(data)
            } else {
                const data = await RecipeService.getSavedRecipes(userId)
                setSavedRecipes(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchRecipes()
        setIsRefreshing(false)
    }

    const handleRecipePress = (recipe: Recipe) => {
        navigation.navigate("RecipeDetail", { id: recipe.id })
    }

    const handleAddRecipe = () => {
        navigation.navigate("AddRecipe")
    }

    const currentRecipes = activeTab === "myPosts" ? myRecipes : savedRecipes

    return (
        <Screen preset="fixed" contentContainerStyle={themed($screenContainer)} safeAreaEdges={["top"]}>
            {/* Header */}
            <View style={themed($header)}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={themed($backButton)}>
                    <Icon icon="back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text preset="heading" text="My Recipes" />
                <View style={{ width: 24 }} />
            </View>

            {/* Tab Navigation */}
            <View style={themed($tabContainer)}>
                <TouchableOpacity
                    style={themed([$tab, activeTab === "myPosts" && $tabActive])}
                    onPress={() => setActiveTab("myPosts")}
                >
                    <Text style={themed([$tabText, activeTab === "myPosts" && $tabTextActive])}>
                        My Posts
                    </Text>
                    {activeTab === "myPosts" && <View style={themed($tabIndicator)} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={themed([$tab, activeTab === "saved" && $tabActive])}
                    onPress={() => setActiveTab("saved")}
                >
                    <Text style={themed([$tabText, activeTab === "saved" && $tabTextActive])}>
                        Saved Recipes
                    </Text>
                    {activeTab === "saved" && <View style={themed($tabIndicator)} />}
                </TouchableOpacity>
            </View>

            {/* Recipe Grid */}
            {isLoading ? (
                <View style={themed($loadingContainer)}>
                    <ActivityIndicator size="large" color={theme.colors.palette.primary500} />
                </View>
            ) : (
                <FlatList
                    data={currentRecipes}
                    renderItem={({ item }) => <RecipeCard recipe={item} onPress={handleRecipePress} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={themed($listContent)}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.palette.primary500}
                        />
                    }
                    ListEmptyComponent={
                        <View style={themed($emptyState)}>
                            <Icon
                                icon={activeTab === "myPosts" ? "chef" : "bookmark"}
                                size={64}
                                color={theme.colors.textDim}
                            />
                            <Text
                                text={
                                    activeTab === "myPosts"
                                        ? "You haven't created any recipes yet"
                                        : "You haven't saved any recipes yet"
                                }
                                style={themed($emptyStateTitle)}
                            />
                            <Text
                                text={
                                    activeTab === "myPosts"
                                        ? "Share your culinary creations with the community!"
                                        : "Bookmark your favorite recipes to find them easily"
                                }
                                style={themed($emptyStateSubtitle)}
                            />
                            {activeTab === "myPosts" && (
                                <TouchableOpacity style={themed($emptyStateButton)} onPress={handleAddRecipe}>
                                    <Icon icon="plus" size={20} color={theme.colors.palette.neutral100} />
                                    <Text text="Create Recipe" style={themed($emptyStateButtonText)} />
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                />
            )}

            {/* Floating Action Button (only on My Posts tab) */}
            {activeTab === "myPosts" && (
                <TouchableOpacity style={themed($fab)} onPress={handleAddRecipe} activeOpacity={0.8}>
                    <Icon icon="plus" size={32} color={theme.colors.palette.neutral100} />
                </TouchableOpacity>
            )}
        </Screen>
    )
}

const $screenContainer = ({ spacing }: any) =>
({
    flex: 1,
    paddingHorizontal: spacing.lg,
} as ViewStyle)

const $header = ({ spacing }: any) =>
({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.sm,
} as ViewStyle)

const $backButton = ({ spacing }: any) =>
({
    padding: spacing.xs,
} as ViewStyle)

const $tabContainer = ({ spacing, colors }: any) =>
({
    flexDirection: "row",
    backgroundColor: colors.palette.neutral100,
    borderRadius: 12,
    padding: spacing.xxs,
    marginBottom: spacing.md,
} as ViewStyle)

const $tab = ({ spacing }: any) =>
({
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    position: "relative",
} as ViewStyle)

const $tabActive = ({ colors }: any) =>
({
    backgroundColor: colors.background,
    borderRadius: 10,
} as ViewStyle)

const $tabText = ({ colors }: any) =>
({
    fontSize: 14,
    fontWeight: "500",
    color: colors.textDim,
} as TextStyle)

const $tabTextActive = ({ colors }: any) =>
({
    color: colors.text,
    fontWeight: "600",
} as TextStyle)

const $tabIndicator = ({ colors }: any) =>
({
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: colors.palette.primary500,
    borderRadius: 2,
} as ViewStyle)

const $loadingContainer = () =>
({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
} as ViewStyle)

const $listContent = ({ spacing }: any) =>
({
    paddingBottom: spacing.xxl * 2,
} as ViewStyle)

const $emptyState = ({ spacing }: any) =>
({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
} as ViewStyle)

const $emptyStateTitle = ({ spacing, colors }: any) =>
({
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.md,
    textAlign: "center",
} as TextStyle)

const $emptyStateSubtitle = ({ spacing, colors }: any) =>
({
    fontSize: 14,
    color: colors.textDim,
    marginTop: spacing.xs,
    textAlign: "center",
    lineHeight: 20,
} as TextStyle)

const $emptyStateButton = ({ spacing, colors }: any) =>
({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.primary500,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    marginTop: spacing.lg,
    gap: spacing.xs,
} as ViewStyle)

const $emptyStateButtonText = ({ colors }: any) =>
({
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "600",
} as TextStyle)

const $fab = ({ spacing, colors }: any) =>
({
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.palette.primary500,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
} as ViewStyle)

import React, { FC, useState, useMemo, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import {
    View,
    ViewStyle,
    FlatList,
    TouchableOpacity,
    TextInput,
    TextStyle,
    Modal,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { RecipeCard } from "@/components/RecipeCard"
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"

// TODO: update navigator types to include this screen
import { TabScreenProps } from "@/navigators/navigationTypes"

// TODO: update navigator types to include this screen
interface RecipeListScreenProps extends TabScreenProps<"Recipes"> { }

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard"
type SortOption = "latest" | "mostLiked" | "rating"
type ViewMode = "list" | "grid"

const ITEMS_PER_PAGE = 5

export const RecipeListScreen: FC<RecipeListScreenProps> = ({ navigation }) => {
    const { themed, theme } = useAppTheme()
    const { logout } = useAuth()

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All")
    const [sortBy, setSortBy] = useState<SortOption>("latest")
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE)

    useFocusEffect(
        useCallback(() => {
            fetchRecipes()
        }, [])
    )

    const fetchRecipes = async () => {
        setIsLoading(true)
        try {
            const data = await RecipeService.getRecipes()
            setRecipes(data)
            setDisplayedCount(ITEMS_PER_PAGE) // Reset to initial count
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            const data = await RecipeService.getRecipes()
            setRecipes(data)
            setDisplayedCount(ITEMS_PER_PAGE) // Reset pagination on refresh
        } catch (e) {
            console.error(e)
        } finally {
            setIsRefreshing(false)
        }
    }

    const loadMore = () => {
        if (displayedCount < filteredRecipes.length) {
            setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredRecipes.length))
        }
    }

    // Filter and sort recipes
    const filteredRecipes = useMemo(() => {
        let filtered = [...recipes]

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (recipe) =>
                    recipe.title.toLowerCase().includes(query) ||
                    recipe.description.toLowerCase().includes(query) ||
                    recipe.ingredients.some((ing) => ing.toLowerCase().includes(query))
            )
        }

        // Difficulty filter
        if (difficultyFilter !== "All") {
            filtered = filtered.filter((recipe) => recipe.difficulty === difficultyFilter)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "mostLiked":
                    return b.likesCount - a.likesCount
                case "rating":
                    return b.rating - a.rating
                case "latest":
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        return filtered
    }, [recipes, searchQuery, difficultyFilter, sortBy])

    // Paginated recipes
    const paginatedRecipes = useMemo(() => {
        return filteredRecipes.slice(0, displayedCount)
    }, [filteredRecipes, displayedCount])

    const handleRecipePress = (recipe: Recipe) => {
        navigation.navigate("RecipeDetail", { id: recipe.id })
    }

    const handleLike = (recipe: Recipe) => {
        RecipeService.handleLike(recipe, (updatedRecipe) => {
            setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
        })
    }

    const handleSave = (recipe: Recipe) => {
        RecipeService.handleSave(recipe, (updatedRecipe) => {
            setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
        })
    }

    const handleAddRecipe = () => {
        navigation.navigate("AddRecipe")
    }

    const clearFilters = () => {
        setSearchQuery("")
        setDifficultyFilter("All")
        setSortBy("latest")
    }

    const activeFiltersCount = [
        searchQuery.trim() !== "",
        difficultyFilter !== "All",
        sortBy !== "latest",
    ].filter(Boolean).length

    return (
        <View style={{ flex: 1 }}>
            <Screen
                preset="fixed"
                contentContainerStyle={themed($screenContentContainer)}
                safeAreaEdges={["top"]}
            >
                {/* Fixed Header */}
                <View style={themed($header)}>
                    <Text style={themed($headerTitle)}>Recipes</Text>
                    <TouchableOpacity onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                        <Icon
                            icon={viewMode === "list" ? "components" : "view"}
                            size={24}
                            color={theme.colors.palette.primary500}
                        />
                    </TouchableOpacity>
                </View>

                {/* Fixed Search Bar */}
                <View style={themed($searchContainer)}>
                    <View style={themed($searchBar)}>
                        <Icon icon="search" size={20} color={theme.colors.textDim} />
                        <TextInput
                            style={themed($searchInput)}
                            placeholder="Search recipes..."
                            placeholderTextColor={theme.colors.textDim}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Icon icon="x" size={20} color={theme.colors.textDim} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={themed($filterButton)} onPress={() => setShowFilters(true)}>
                        <Icon icon="menu" size={20} color={theme.colors.palette.primary500} />
                        {activeFiltersCount > 0 && (
                            <View style={themed($filterBadge)}>
                                <Text style={themed($filterBadgeText)}>{activeFiltersCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && !isLoading && (
                    <View style={themed($activeFiltersContainer)}>
                        <Text style={themed($activeFiltersLabel)}>Active filters:</Text>
                        {difficultyFilter !== "All" && (
                            <View style={themed($filterChip)}>
                                <Text style={themed($filterChipText)}>{difficultyFilter}</Text>
                                <TouchableOpacity onPress={() => setDifficultyFilter("All")}>
                                    <Icon icon="x" size={14} color={theme.colors.palette.primary500} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {sortBy !== "latest" && (
                            <View style={themed($filterChip)}>
                                <Text style={themed($filterChipText)}>
                                    {sortBy === "mostLiked" ? "Most Liked" : "Top Rated"}
                                </Text>
                                <TouchableOpacity onPress={() => setSortBy("latest")}>
                                    <Icon icon="x" size={14} color={theme.colors.palette.primary500} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity onPress={clearFilters}>
                            <Text style={themed($clearFiltersText)}>Clear all</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* FlatList with Pagination */}
                <FlatList
                    data={isLoading ? [] : paginatedRecipes}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            onPress={handleRecipePress}
                            onLike={handleLike}
                            onSave={handleSave}
                            style={viewMode === "grid" ? themed($gridCard) : undefined}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={viewMode === "grid" ? 2 : 1}
                    key={viewMode} // Force re-render when changing columns
                    contentContainerStyle={themed($listContent)}
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={
                        isLoading ? (
                            <View style={themed($skeletonContainer)}>
                                {[1, 2].map((i) => (
                                    <RecipeCardSkeleton key={`skeleton-${i}`} />
                                ))}
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        !isLoading ? (
                            <View style={themed($emptyState)}>
                                <Icon icon="search" size={48} color={theme.colors.textDim} />
                                <Text text="No recipes found" style={themed($emptyStateText)} />
                                {activeFiltersCount > 0 && (
                                    <TouchableOpacity onPress={clearFilters} style={themed($clearButton)}>
                                        <Text text="Clear filters" style={themed($clearButtonText)} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        !isLoading && paginatedRecipes.length < filteredRecipes.length ? (
                            <View style={themed($loadingMore)}>
                                <Text style={themed($loadingMoreText)}>
                                    Loading more... ({paginatedRecipes.length}/{filteredRecipes.length})
                                </Text>
                            </View>
                        ) : null
                    }
                />

                {/* Filter Modal */}
                <Modal visible={showFilters} transparent animationType="slide">
                    <View style={themed($modalOverlay)}>
                        <View style={themed($modalContent)}>
                            <View style={themed($modalHeader)}>
                                <Text preset="subheading" text="Filters & Sort" />
                                <TouchableOpacity onPress={() => setShowFilters(false)}>
                                    <Icon icon="x" size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>

                            {/* Difficulty Filter */}
                            <View style={themed($filterSection)}>
                                <Text style={themed($filterLabel)}>Difficulty</Text>
                                <View style={themed($filterOptions)}>
                                    {(["All", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((level) => (
                                        <TouchableOpacity
                                            key={level}
                                            style={themed([
                                                $filterOption,
                                                difficultyFilter === level && $filterOptionActive,
                                            ])}
                                            onPress={() => setDifficultyFilter(level)}
                                        >
                                            <Text
                                                style={themed([
                                                    $filterOptionText,
                                                    difficultyFilter === level && $filterOptionTextActive,
                                                ])}
                                            >
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Sort By */}
                            <View style={themed($filterSection)}>
                                <Text style={themed($filterLabel)}>Sort By</Text>
                                <View style={themed($filterOptions)}>
                                    <TouchableOpacity
                                        style={themed([$filterOption, sortBy === "latest" && $filterOptionActive])}
                                        onPress={() => setSortBy("latest")}
                                    >
                                        <Text
                                            style={themed([
                                                $filterOptionText,
                                                sortBy === "latest" && $filterOptionTextActive,
                                            ])}
                                        >
                                            Latest
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={themed([$filterOption, sortBy === "mostLiked" && $filterOptionActive])}
                                        onPress={() => setSortBy("mostLiked")}
                                    >
                                        <Text
                                            style={themed([
                                                $filterOptionText,
                                                sortBy === "mostLiked" && $filterOptionTextActive,
                                            ])}
                                        >
                                            Most Liked
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={themed([$filterOption, sortBy === "rating" && $filterOptionActive])}
                                        onPress={() => setSortBy("rating")}
                                    >
                                        <Text
                                            style={themed([
                                                $filterOptionText,
                                                sortBy === "rating" && $filterOptionTextActive,
                                            ])}
                                        >
                                            Top Rated
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Apply Button */}
                            <TouchableOpacity
                                style={themed($applyButton)}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={themed($applyButtonText)}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Screen>

            {/* Floating Action Button - Fixed Position */}
            <TouchableOpacity style={themed($fab)} onPress={handleAddRecipe} activeOpacity={0.8}>
                <Icon icon="plus" size={32} color={theme.colors.palette.neutral100} />
            </TouchableOpacity>
        </View>
    )
}

const $screenContentContainer = ({ spacing }: any) =>
({
    flex: 1,
    paddingHorizontal: spacing.md,
} as ViewStyle)

const $header = ({ spacing }: any) =>
({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
} as ViewStyle)

const $headerTitle = ({ typography, colors }: any) =>
({
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.text,
} as TextStyle)

const $gridCard = () =>
({
    flex: 1,
    marginHorizontal: 4,
} as ViewStyle)

const $listContent = () =>
({
    paddingBottom: 100,
} as ViewStyle)

const $loadingMore = ({ spacing }: any) =>
({
    paddingVertical: spacing.md,
    alignItems: "center",
} as ViewStyle)

const $loadingMoreText = ({ colors }: any) =>
({
    fontSize: 14,
    color: colors.textDim,
} as TextStyle)

const $searchContainer = ({ spacing }: any) =>
({
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
} as ViewStyle)

const $searchBar = ({ spacing, colors }: any) =>
({
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
} as ViewStyle)

const $searchInput = ({ colors, typography }: any) =>
({
    flex: 1,
    fontSize: 16,
    fontFamily: typography.primary.normal,
    color: colors.text,
    padding: 0,
} as TextStyle)

const $filterButton = ({ spacing, colors }: any) =>
({
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.palette.neutral100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
} as ViewStyle)

const $filterBadge = ({ colors }: any) =>
({
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.palette.primary500,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
} as ViewStyle)

const $filterBadgeText = ({ colors, typography }: any) =>
({
    color: colors.palette.neutral100,
    fontSize: 10,
    fontFamily: typography.primary.bold,
} as TextStyle)

const $activeFiltersContainer = ({ spacing }: any) =>
({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
} as ViewStyle)

const $activeFiltersLabel = ({ colors }: any) =>
({
    fontSize: 12,
    color: colors.textDim,
    fontWeight: "600",
} as TextStyle)

const $filterChip = ({ spacing, colors }: any) =>
({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.primary100 || colors.palette.neutral200,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
} as ViewStyle)

const $filterChipText = ({ colors }: any) =>
({
    fontSize: 12,
    color: colors.palette.primary500,
    fontWeight: "600",
} as TextStyle)

const $clearFiltersText = ({ colors }: any) =>
({
    fontSize: 12,
    color: colors.palette.primary500,
    fontWeight: "600",
    textDecorationLine: "underline",
} as TextStyle)

const $skeletonContainer = () =>
({
    paddingTop: 8,
} as ViewStyle)

const $recipesContainer = () =>
({
    paddingBottom: 8,
} as ViewStyle)

const $emptyState = ({ spacing }: any) =>
({
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
} as ViewStyle)

const $emptyStateText = ({ spacing }: any) =>
({
    marginTop: 8,
    marginBottom: 16,
} as TextStyle)

const $clearButton = ({ spacing, colors }: any) =>
({
    backgroundColor: colors.palette.primary500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
} as ViewStyle)

const $clearButtonText = ({ colors }: any) =>
({
    color: colors.palette.neutral100,
    fontWeight: "600",
} as TextStyle)

const $fab = ({ spacing, colors }: any) =>
({
    position: "absolute",
    bottom: 16,
    right: 8,
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

const $modalOverlay = () =>
({
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
} as ViewStyle)

const $modalContent = ({ spacing, colors }: any) =>
({
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: "80%",
} as ViewStyle)

const $modalHeader = ({ spacing }: any) =>
({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
} as ViewStyle)

const $filterSection = ({ spacing }: any) =>
({
    marginBottom: spacing.lg,
} as ViewStyle)

const $filterLabel = ({ spacing, colors }: any) =>
({
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
} as TextStyle)

const $filterOptions = ({ spacing }: any) =>
({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
} as ViewStyle)

const $filterOption = ({ spacing, colors }: any) =>
({
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.palette.neutral300,
    backgroundColor: colors.palette.neutral100,
} as ViewStyle)

const $filterOptionActive = ({ colors }: any) =>
({
    backgroundColor: colors.palette.primary500,
    borderColor: colors.palette.primary500,
} as ViewStyle)

const $filterOptionText = ({ colors }: any) =>
({
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
} as TextStyle)

const $filterOptionTextActive = ({ colors }: any) =>
({
    color: colors.palette.neutral100,
    fontWeight: "600",
} as TextStyle)

const $applyButton = ({ spacing, colors }: any) =>
({
    backgroundColor: colors.palette.primary500,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
} as ViewStyle)

const $applyButtonText = ({ colors, typography }: any) =>
({
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: typography.primary.medium,
} as TextStyle)

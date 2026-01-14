import React, { FC, useEffect, useState, useRef } from "react"
import {
    View,
    ViewStyle,
    TextStyle,
    ImageStyle,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Alert,
    StyleSheet
} from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { useAuth } from "@/context/AuthContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

interface RecipeDetailScreenProps extends AppStackScreenProps<"RecipeDetail"> { }

const { width } = Dimensions.get("window")
const HEADER_HEIGHT = 300

export const RecipeDetailScreen: FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
    const { id } = route.params
    const { session } = useAuth()
    const user = session?.user
    const insets = useSafeAreaInsets()

    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const scrollY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        fetchRecipe()
    }, [id])

    const fetchRecipe = async () => {
        setIsLoading(true)
        try {
            // Check if full recipe data was passed (e.g. from AI generation)
            if (route.params.recipeData) {
                setRecipe(route.params.recipeData)
                setIsLiked(route.params.recipeData.isLiked)
                setIsSaved(route.params.recipeData.isSaved)
                setIsLoading(false)
                return
            }

            const data = await RecipeService.getRecipeById(id)
            if (data) {
                setRecipe(data)
                setIsLiked(data.isLiked)
                setIsSaved(data.isSaved)
            } else {
                Alert.alert("Error", "Recipe not found")
                navigation.goBack()
            }
        } catch (e: any) {
            console.error(e)
            Alert.alert("Error", `Failed to load recipe: ${e.message || JSON.stringify(e)}`)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleLike = async () => {
        if (!recipe) return
        const newState = !isLiked
        setIsLiked(newState) // Optimistic
        try {
            await RecipeService.toggleLike(recipe.id, isLiked) // Pass *current* backend state? No, passing previous state logic depends on service impl. 
            // Service implementation: if (isLiked) delete else insert. 
            // So we should pass the *current state before toggle* to the service if it acted as "remove if present".
            // But my service logic: check isLiked arg. If true -> delete. So I should pass the *original* state (isLiked state before toggle).
            // Wait, let's check service logic:
            // if (isLiked) { delete } else { insert }
            // So if I am currently liked (true), I want to unlike. So passing `true` works.
            // If I am not liked (false), I want to like. So passing `false` works.
            // Ideally should update local count too.
        } catch (e) {
            setIsLiked(!newState) // Revert
            Alert.alert("Error", "Failed to update like")
        }
    }

    const toggleSave = async () => {
        if (!recipe) return
        const newState = !isSaved
        setIsSaved(newState)
        try {
            await RecipeService.toggleSave(recipe.id, isSaved)
        } catch (e) {
            setIsSaved(!newState)
            Alert.alert("Error", "Failed to save recipe")
        }
    }

    if (isLoading || !recipe) {
        return (
            <View style={$loadingContainer}>
                <Text>Loading...</Text>
            </View>
        )
    }

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })

    return (
        <View style={$container}>
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={$imageContainer}>
                    <Image source={{ uri: recipe.imageUrl }} style={$image} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={$gradient}
                    />
                    <View style={$heroContent}>
                        <Text style={$heroTitle}>{recipe.title}</Text>
                        <View style={$authorRow}>
                            <Image source={{ uri: recipe.authorImageUrl }} style={$authorImage} />
                            <Text style={$authorName}>{recipe.authorName}</Text>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity style={$followButton}>
                                <Text style={$followText}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={$contentContainer}>
                    {/* Stats */}
                    <View style={$statsRow}>
                        <StatItem icon="heart" value={recipe.likesCount.toString()} label="Likes" color={isLiked ? colors.palette.appPrimary : colors.textDim} />
                        <StatItem icon="chat" value={recipe.commentsCount.toString()} label="Comments" color={colors.textDim} />
                        <StatItem icon="clock" value={`${recipe.cookingTimeMinutes}m`} label="Time" color={colors.textDim} />
                        <StatItem icon="star" value={recipe.rating.toFixed(1)} label="Rating" color={colors.palette.angry500} />
                    </View>

                    {/* Ingredients */}
                    <Section title="Ingredients">
                        {recipe.ingredients.map((ing, i) => (
                            <View key={i} style={$bulletRow}>
                                <View style={$bullet} />
                                <Text style={$bulletText}>{ing}</Text>
                            </View>
                        ))}
                    </Section>

                    {/* Instructions */}
                    <Section title="Instructions">
                        {recipe.steps.map((step, i) => (
                            <View key={i} style={$stepRow}>
                                <View style={$stepCircle}>
                                    <Text style={$stepNumber}>{i + 1}</Text>
                                </View>
                                <Text style={$stepText}>{step}</Text>
                            </View>
                        ))}
                    </Section>

                    {/* Comments Placeholder */}
                    <Section title="Comments">
                        <Text style={{ color: colors.textDim }}>Comments section coming soon...</Text>
                    </Section>
                </View>
            </Animated.ScrollView>

            {/* Header (Back button etc) */}
            <View style={[
                $header,
                { paddingTop: insets.top + spacing.xs, height: insets.top + 60 }
            ]}>
                <Animated.View style={[
                    $headerBackground,
                    { opacity: headerOpacity }
                ]} />

                <View style={$headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={$iconButton}>
                        <Icon icon="back" color={colors.palette.neutral100} size={24} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity style={$iconButton} onPress={() => { }}>
                        <Icon icon="share" color={colors.palette.neutral100} size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={$iconButton} onPress={toggleSave}>
                        <Icon icon={isSaved ? "bookmark" : "bookmarkOutline"} color={colors.palette.neutral100} size={24} />
                        {/* Note: need proper icons for bookmark */}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Bar */}
            <View style={[
                $bottomBar,
                { paddingBottom: insets.bottom + spacing.xs }
            ]}>
                <TouchableOpacity onPress={toggleLike} style={$actionButton}>
                    <Icon icon={isLiked ? "heart" : "heartOutline"} color={isLiked ? colors.palette.appPrimary : colors.textDim} size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={$actionButton}>
                    <Icon icon="chat" color={colors.textDim} size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={$actionButton}>
                    <Icon icon="share" color={colors.textDim} size={28} />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={$saveButton}>
                    <Text style={$saveButtonText}>Save Recipe</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const StatItem = ({ icon, value, label, color }: any) => (
    <View style={{ alignItems: 'center' }}>
        {/* Placeholder for Icon usage, assuming icon prop name matches */}
        <Icon icon={icon} color={color} size={20} />
        <Text style={{ fontWeight: 'bold', marginTop: 4 }}>{value}</Text>
        <Text style={{ fontSize: 12, color: colors.textDim }}>{label}</Text>
    </View>
)

const Section = ({ title, children }: any) => (
    <View style={$section}>
        <Text style={$sectionTitle}>{title}</Text>
        {children}
    </View>
)

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}
const $loadingContainer: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
}
const $imageContainer: ViewStyle = {
    height: HEADER_HEIGHT,
    width: '100%',
}
const $image: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
}
const $gradient: ViewStyle = {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 200,
}
const $heroContent: ViewStyle = {
    position: 'absolute',
    bottom: 20, left: 20, right: 20,
}
const $heroTitle: TextStyle = {
    color: 'white',
    fontSize: 28,
    fontFamily: typography.primary.bold,
    marginBottom: spacing.xs,
}
const $authorRow: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
}
const $authorImage: ImageStyle = {
    width: 24, height: 24, borderRadius: 12, marginRight: 8
}
const $authorName: TextStyle = {
    color: 'white', fontWeight: '600'
}
const $followButton: ViewStyle = {
    backgroundColor: colors.palette.secondary500 || '#3498db',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20
}
const $followText: TextStyle = {
    color: 'white', fontSize: 12, fontWeight: 'bold'
}
const $contentContainer: ViewStyle = {
    backgroundColor: colors.background, // overlap?
}
const $statsRow: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    backgroundColor: colors.palette.neutral100,
    margin: spacing.md,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
}
const $section: ViewStyle = {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.palette.neutral100,
    marginHorizontal: spacing.md,
    borderRadius: 16,
}
const $sectionTitle: TextStyle = {
    fontSize: 18, fontFamily: typography.primary.bold, marginBottom: spacing.sm
}
const $bulletRow: ViewStyle = {
    flexDirection: 'row', alignItems: 'center', marginBottom: 6
}
const $bullet: ViewStyle = {
    width: 6, height: 6, borderRadius: 3, backgroundColor: colors.palette.appPrimary, marginRight: 12
}
const $bulletText: TextStyle = {
    flex: 1, lineHeight: 20
}
const $stepRow: ViewStyle = {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12
}
const $stepCircle: ViewStyle = {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.palette.appPrimary,
    justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2
}
const $stepNumber: TextStyle = {
    color: 'white', fontSize: 12, fontWeight: 'bold'
}
const $stepText: TextStyle = {
    flex: 1, lineHeight: 22
}
const $header: ViewStyle = {
    position: 'absolute', top: 0, left: 0, right: 0,
}
const $headerBackground: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    borderBottomWidth: 1, borderBottomColor: colors.palette.neutral200
}
const $headerRow: ViewStyle = {
    flexDirection: 'row', paddingHorizontal: spacing.md,
}
const $iconButton: ViewStyle = {
    padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, marginLeft: 8
}
const $bottomBar: ViewStyle = {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.palette.neutral100,
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.palette.neutral200
}
const $actionButton: ViewStyle = {
    padding: 8, marginRight: 8
}
const $saveButton: ViewStyle = {
    backgroundColor: colors.palette.secondary500 || '#3498db',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24
}
const $saveButtonText: TextStyle = {
    color: 'white', fontWeight: 'bold'
}

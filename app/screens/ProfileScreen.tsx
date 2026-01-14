import React, { FC, useEffect, useState } from "react"
import { View, Image, ActivityIndicator, ViewStyle, TextStyle, ImageStyle, TouchableOpacity, ScrollView } from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"
import { RecipeService } from "@/services/api/RecipeService"
import { Recipe } from "@/models/Recipe"
import { ProfileStats } from "@/components/ProfileStats"
import { CuisineTags } from "@/components/CuisineTags"
import { AchievementBadges } from "@/components/AchievementBadges"
import { ProfileRecipeGrid } from "@/components/ProfileRecipeGrid"
import { useAuth } from "@/context/AuthContext"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> { }

export const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
    const { session, logout } = useAuth()
    const user = session?.user
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchMyRecipes()
    }, [])

    const fetchMyRecipes = async () => {
        if (!user) return
        setIsLoading(true)
        const data = await RecipeService.getUserRecipes(user.id)
        setMyRecipes(data)
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
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with Settings */}
                <View style={$header}>
                    <Text style={$headerTitle}>Profile</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                        <Icon icon="settings" size={24} color={colors.textDim} />
                    </TouchableOpacity>
                </View>

                {/* Profile Header */}
                <View style={$profileHeader}>
                    <View style={$avatarContainer}>
                        <Image
                            source={{ uri: user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=200" }}
                            style={$avatar}
                        />
                        <TouchableOpacity style={$cameraButton}>
                            <Icon icon="camera" size={16} color={colors.palette.neutral100} />
                        </TouchableOpacity>
                    </View>

                    <Text style={$name}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Chef"}</Text>
                    <Text style={$bio}>
                        Home cook passionate about healthy, delicious meals. Love experimenting with Mediterranean and Asian cuisines! 🍳✨
                    </Text>

                    <TouchableOpacity style={$editButton} onPress={() => navigation.navigate("EditProfile")}>
                        <Text style={$editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Stats */}
                <ProfileStats
                    recipesShared={myRecipes.length}
                    followers={1234}
                    following={567}
                />

                {/* Favorite Cuisines */}
                <View style={$section}>
                    <Text style={$sectionTitle}>Favorite Cuisines</Text>
                    <CuisineTags />
                </View>

                {/* Cooking Achievements */}
                <View style={$section}>
                    <Text style={$sectionTitle}>Cooking Achievements</Text>
                    <AchievementBadges />
                </View>

                {/* Recipe Collection */}
                <View style={$section}>
                    <View style={$sectionHeader}>
                        <Text style={$sectionTitle}>My Recipe Collection</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("MyRecipes")}>
                            <Text style={$viewAllText}>View All →</Text>
                        </TouchableOpacity>
                    </View>
                    <ProfileRecipeGrid recipes={myRecipes} onRecipePress={handleRecipePress} />
                </View>

                <View style={$bottomSpacer} />
            </ScrollView>
        </Screen>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
}

const $headerTitle: TextStyle = {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.text,
}

const $profileHeader: ViewStyle = {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
}

const $avatarContainer: ViewStyle = {
    position: "relative",
    marginBottom: spacing.md,
}

const $avatar: ImageStyle = {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.palette.appPrimary,
}

const $cameraButton: ViewStyle = {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.palette.appPrimary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: colors.background,
}

const $name: TextStyle = {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.text,
    marginBottom: spacing.xs,
}

const $bio: TextStyle = {
    textAlign: "center",
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
}

const $editButton: ViewStyle = {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.palette.appPrimary,
    width: "100%",
    alignItems: "center",
}

const $editButtonText: TextStyle = {
    color: colors.palette.appPrimary,
    fontWeight: "600",
}

const $section: ViewStyle = {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
}

const $sectionTitle: TextStyle = {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    color: colors.text,
    marginBottom: spacing.md,
}

const $sectionHeader: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
}

const $viewAllText: TextStyle = {
    fontSize: 14,
    color: colors.palette.appPrimary,
    fontWeight: "600",
}

const $loadingContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}

const $bottomSpacer: ViewStyle = {
    height: spacing.xl,
}

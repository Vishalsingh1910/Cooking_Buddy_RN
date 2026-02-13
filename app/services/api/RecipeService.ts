import { supabase } from "../supabase/supabase"
import { Recipe } from "../../models/Recipe"
import { Alert } from "react-native"

export const RecipeService = {
    async getRecipes(): Promise<Recipe[]> {
        // Get current user ID
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id

        const { data, error } = await supabase
            .from("recipes")
            .select(`
        *,
        users:user_id (
          display_name,
          photo_url
        ),
        recipe_likes (count),
        recipe_comments (count)
      `)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching recipes:", error)
            return []
        }

        // If user is logged in, fetch their likes and saves
        let userLikes: Set<string> = new Set()
        let userSaves: Set<string> = new Set()

        if (currentUserId) {
            // Fetch user's likes
            const { data: likesData } = await supabase
                .from("recipe_likes")
                .select("recipe_id")
                .eq("user_id", currentUserId)

            if (likesData) {
                userLikes = new Set(likesData.map(l => l.recipe_id))
            }

            // Fetch user's saves
            const { data: savesData } = await supabase
                .from("saved_recipes")
                .select("recipe_id")
                .eq("user_id", currentUserId)

            if (savesData) {
                userSaves = new Set(savesData.map(s => s.recipe_id))
            }
        }

        return data.map((item: any) => mapSupabaseToRecipe(item, userLikes, userSaves))
    },

    async getRecipeById(id: string): Promise<Recipe | null> {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id

        const { data, error } = await supabase
            .from("recipes")
            .select(`
        *,
        users:user_id (
          display_name,
          photo_url
        ),
        recipe_likes (count),
        recipe_comments (
            *,
            users:user_id (
                display_name,
                photo_url
            )
        )
      `)
            .eq("recipe_id", id)
            .single()

        if (error) {
            console.error("Error fetching recipe:", error)
            throw error;
        }

        // Fetch user specific interaction if authenticated
        let isLiked = false
        let isSaved = false

        if (currentUserId) {
            const { data: likeData } = await supabase.from("recipe_likes").select("*").eq("recipe_id", id).eq("user_id", currentUserId).maybeSingle()
            isLiked = !!likeData

            const { data: saveData } = await supabase.from("saved_recipes").select("*").eq("recipe_id", id).eq("user_id", currentUserId).maybeSingle()
            isSaved = !!saveData
        }

        const recipe = mapSupabaseToRecipe(data)
        recipe.isLiked = isLiked
        recipe.isSaved = isSaved
        return recipe
    },

    async createRecipe(recipe: Partial<Recipe> & { imageUrl?: string }) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not authenticated")

        const recipeData: any = {
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            cooking_time_minutes: recipe.cookingTimeMinutes,
            difficulty: recipe.difficulty || "Medium",
            user_id: session.user.id,
            likes_count: 0,
            comments_count: 0,
            rating: 0,
        }

        if (recipe.imageUrl) {
            recipeData.image_url = recipe.imageUrl
        }

        return await supabase.from("recipes").insert(recipeData).select().single()
    },

    async postAIRecipe(recipe: Recipe) {
        // Reuse createRecipe, ensuring we pass the image URL
        // We strip the ID so Supabase generates a new UUID
        const { id, ...recipeData } = recipe
        return await this.createRecipe({
            ...recipeData,
            imageUrl: recipe.imageUrl
        })
    },

    async toggleLike(recipeId: string, isLiked: boolean) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not authenticated")

        if (isLiked) {
            // Unlike
            return await supabase.from("recipe_likes").delete().match({ user_id: session.user.id, recipe_id: recipeId })
        } else {
            // Like
            return await supabase.from("recipe_likes").insert({ user_id: session.user.id, recipe_id: recipeId })
        }
    },

    async toggleSave(recipeId: string, isSaved: boolean) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not authenticated")

        if (isSaved) {
            // Unsave
            return await supabase.from("saved_recipes").delete().match({ user_id: session.user.id, recipe_id: recipeId })
        } else {
            // Save
            return await supabase.from("saved_recipes").insert({ user_id: session.user.id, recipe_id: recipeId })
        }
    },

    async handleLike(recipe: Recipe, onUpdate: (updatedRecipe: Recipe) => void) {
        // 1. Calculate optimistic state
        const originalRecipe = { ...recipe }
        const newIsLiked = !recipe.isLiked
        const newLikesCount = newIsLiked ? recipe.likesCount + 1 : Math.max(0, recipe.likesCount - 1)

        const optimisticRecipe = {
            ...recipe,
            isLiked: newIsLiked,
            likesCount: newLikesCount
        }

        // 2. Update UI immediately
        onUpdate(optimisticRecipe)

        try {
            // 3. Call API
            // Note: We pass the *original* isLiked status to toggle it
            await this.toggleLike(recipe.id, recipe.isLiked)
        } catch (error) {
            console.error("Error toggling like:", error)
            // 4. Revert on error
            onUpdate(originalRecipe)
            Alert.alert("Error", "Failed to update like status")
        }
    },

    async handleSave(recipe: Recipe, onUpdate: (updatedRecipe: Recipe) => void) {
        // 1. Calculate optimistic state
        const originalRecipe = { ...recipe }
        const newIsSaved = !recipe.isSaved

        const optimisticRecipe = {
            ...recipe,
            isSaved: newIsSaved
        }

        // 2. Update UI immediately
        onUpdate(optimisticRecipe)

        try {
            // 3. Call API
            await this.toggleSave(recipe.id, recipe.isSaved)
        } catch (error) {
            console.error("Error toggling save:", error)
            // 4. Revert on error
            onUpdate(originalRecipe)
            Alert.alert("Error", "Failed to update save status")
        }
    },

    async addComment(recipeId: string, text: string) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not authenticated")

        const { data, error } = await supabase
            .from("recipe_comments")
            .insert({
                recipe_id: recipeId,
                user_id: session.user.id,
                text: text
            })
            .select(`
                *,
                users:user_id (
                    display_name,
                    photo_url
                )
            `)
            .single()

        if (error) throw error

        return {
            id: data.id,
            text: data.text,
            createdAt: data.created_at,
            authorName: data.users?.display_name || "Unknown",
            authorImageUrl: data.users?.photo_url || "",
            likesCount: 0,
            isLiked: false
        }
    },

    async getUserRecipes(userId: string): Promise<Recipe[]> {
        try {
            console.log("Fetching recipes for user:", userId, "Type:", typeof userId)

            const { data, error } = await supabase
                .from("recipes")
                .select(`
            *,
            users:user_id (
              display_name,
              photo_url
            ),
            recipe_likes (count),
            recipe_comments (count)
          `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Error fetching user recipes:", error)
                console.error("Error details - Code:", error.code, "Message:", error.message)
                console.error("Hint:", error.hint, "Details:", error.details)

                // If this is a type mismatch error, provide helpful guidance
                if (error.message?.includes("bigint") || error.code === "22P02") {
                    console.error("⚠️ DATABASE SCHEMA ISSUE: The user_id column appears to be bigint but should be uuid")
                    console.error("Please update your database schema: ALTER TABLE recipes ALTER COLUMN user_id TYPE uuid USING user_id::text::uuid;")
                }

                return []
            }

            return data.map((item: any) => mapSupabaseToRecipe(item))
        } catch (err) {
            console.error("Unexpected error in getUserRecipes:", err)
            return []
        }
    },

    async getSavedRecipes(userId: string): Promise<Recipe[]> {
        const { data, error } = await supabase
            .from("saved_recipes")
            .select(`
                recipe:recipe_id (
                    *,
                    users:user_id (
                        display_name,
                        photo_url
                    ),
                    recipe_likes (count),
                    recipe_comments (count)
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching saved recipes:", error)
            return []
        }

        return data
            .map((item: any) => item.recipe ? mapSupabaseToRecipe(item.recipe) : null)
            .filter((r): r is Recipe => r !== null)
    },

    async uploadRecipeImage(imageUri: string): Promise<string> {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not authenticated")

        try {
            // Convert image URI to ArrayBuffer (better for RN)
            const response = await fetch(imageUri)
            const arrayBuffer = await response.arrayBuffer()

            // Create unique filename
            const fileName = `${session.user.id}_recipe_${Date.now()}.jpg`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from("recipe-images")
                .upload(fileName, arrayBuffer, {
                    contentType: 'image/jpeg',
                    cacheControl: "3600",
                    upsert: false,
                })

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("recipe-images")
                .getPublicUrl(fileName)

            return publicUrl
        } catch (error) {
            console.error("Error uploading image:", error)
            throw new Error("Failed to upload image")
        }
    },

    async createRecipeWithImage(recipe: Partial<Recipe>, imageUri?: string): Promise<any> {
        let imageUrl: string | undefined

        // Upload image if provided
        if (imageUri) {
            imageUrl = await this.uploadRecipeImage(imageUri)
        }

        // Create recipe with image URL
        const recipeData = {
            ...recipe,
            imageUrl,
        }

        return await this.createRecipe(recipeData)
    }
}

function mapSupabaseToRecipe(data: any, userLikes?: Set<string>, userSaves?: Set<string>): Recipe {
    const user = data.users
    const recipeId = data.recipe_id?.toString() || data.id?.toString() || ""

    return {
        id: recipeId,
        title: data.title || "Untitled Recipe",
        imageUrl: data.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        authorName: user?.display_name || "Chef",
        authorImageUrl: user?.photo_url || "https://i.pravatar.cc/150?img=12",
        authorUsername: user?.display_name?.toLowerCase() || "chef",
        description: data.description || "",
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        cookingTimeMinutes: data.cooking_time_minutes || 30,
        rating: data.rating || 0,
        servings: data.servings || 4,
        difficulty: data.difficulty || "Medium",
        calories: data.calories || null,
        likesCount: data.recipe_likes?.[0]?.count || 0,
        commentsCount: data.recipe_comments?.[0]?.count || 0,
        cooksCount: 0,
        createdAt: data.created_at,
        isLiked: userLikes ? userLikes.has(recipeId) : false,
        isSaved: userSaves ? userSaves.has(recipeId) : false,
        comments: Array.isArray(data.recipe_comments) ? data.recipe_comments.map((c: any) => ({
            id: c.id,
            text: c.text,
            createdAt: c.created_at,
            authorName: c.users?.display_name || "Unknown",
            authorImageUrl: c.users?.photo_url || "",
            likesCount: 0,
            isLiked: false
        })) : []
    }
}

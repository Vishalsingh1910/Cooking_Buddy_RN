import { supabase } from "../supabase/supabase"
import { Recipe } from "../../models/Recipe"

export const RecipeService = {
    async getRecipes(): Promise<Recipe[]> {
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

        return data.map((item: any) => mapSupabaseToRecipe(item))
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
            *
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
            // Convert image URI to blob
            const response = await fetch(imageUri)
            const blob = await response.blob()

            // Create unique filename
            const fileName = `${session.user.id}_recipe_${Date.now()}.jpg`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from("recipe-images")
                .upload(fileName, blob, {
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

function mapSupabaseToRecipe(data: any, currentUserId?: string): Recipe {
    const user = data.users
    const likes = data.recipe_likes || []
    const isLiked = Array.isArray(likes) ? likes.some((l: any) => l.user_id === currentUserId) : false

    // For list view, we might not fetch all specific likes rows to check ownership easily without mapped data
    // optimization: backend should return boolean `is_liked_by_user`. 
    // For now, assuming `recipe_likes` in select includes user_id if we filter by it, but we select count.
    // To correctly check `isLiked` in list, we actually need to select `recipe_likes!left(user_id)` with filter.
    // For simplicity in this demo, we might skip `isLiked` in list or do a separate check.
    // Let's rely on data passed in.

    return {
        id: data.recipe_id?.toString() || data.id?.toString() || "",
        title: data.title || "Untitled Recipe",
        imageUrl: data.image_url || "",
        authorName: user?.display_name || "Chef",
        authorImageUrl: user?.photo_url || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=100",
        authorUsername: user?.display_name?.toLowerCase() || "chef",
        description: data.description || "",
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        cookingTimeMinutes: data.cooking_time_minutes || 30,
        rating: data.rating || 4.5,
        servings: 4,
        difficulty: data.difficulty || "Medium",
        likesCount: data.recipe_likes?.[0]?.count || 0,
        commentsCount: data.recipe_comments?.[0]?.count || 0,
        cooksCount: 0,
        createdAt: data.created_at,
        isLiked: false, // implementation of checking this in list is complex with just one query unless using views matches
        isSaved: false,
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

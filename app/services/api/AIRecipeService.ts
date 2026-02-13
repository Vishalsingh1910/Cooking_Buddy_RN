import { Recipe } from "../../models/Recipe"
import { supabase } from "../supabase/supabase"

export const AIRecipeService = {
  async generateRecipe(ingredients: string[]) {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token

    if (!token) {
      throw new Error("No access token found")
    }

    const { data, error } = await supabase.functions.invoke(
      "generate-recipe",
      {
        body: { ingredients },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log('dataaaa', data)

    if (error) throw error
    return mapAIToRecipe(data)
  },
}

function mapAIToRecipe(data: any): Recipe {
    // Helper to estimate cooking time if missing
    const estimateCookingTime = (steps: string[]) => {
        const count = steps.length
        if (count <= 3) return 15
        if (count <= 5) return 25
        if (count <= 7) return 35
        return 45
    }

    // Helper to get image URL based on title (mock logic from Flutter)
    const getRecipeImageUrl = (title: string) => {
        const titleLower = title.toLowerCase()
        if (titleLower.includes("curry")) return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop"
        if (titleLower.includes("chicken")) return "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop"
        if (titleLower.includes("soup")) return "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop"
        if (titleLower.includes("pasta")) return "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop"
        if (titleLower.includes("salad")) return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop"
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
    }

    const steps = Array.isArray(data.steps) ? data.steps : []

    return {
        id: `ai_${Date.now()}`,
        title: data.title || "Generated Recipe",
        imageUrl: getRecipeImageUrl(data.title || ""),
        authorName: "AI Chef",
        authorImageUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png", // Generic robot/AI icon
        authorUsername: "aichef",
        description: data.description || "AI-generated recipe using your selected ingredients",
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        steps: steps,
        cookingTimeMinutes: data.cooking_time_minutes || estimateCookingTime(steps),
        rating: 4.5, // Default rating for AI recipes
        servings: data.servings || 2,
        difficulty: data.difficulty || "Medium",
        likesCount: 0,
        commentsCount: 0,
        cooksCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isSaved: false,
        comments: [],
    }
}

import { Recipe } from "../../models/Recipe"

const BASE_URL = "https://cooking-buddy-apis.onrender.com"
const GENERATE_RECIPE_ENDPOINT = "/generate_recipe"

export const AIRecipeService = {
    async generateRecipe(ingredients: string[]): Promise<Recipe> {
        const url = `${BASE_URL}${GENERATE_RECIPE_ENDPOINT}`

        try {
            // Clean and format ingredients
            const cleanIngredients = processIngredients(ingredients)

            if (cleanIngredients.length === 0) {
                throw new Error("No valid ingredients provided")
            }

            // Limit to 12 ingredients
            const finalIngredients = cleanIngredients.slice(0, 12)

            console.log("🚀 Generating recipe with ingredients:", finalIngredients)

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ ingredients: finalIngredients }),
            })

            console.log("📡 API Response Status:", response.status)

            if (response.ok) {
                const data = await response.json()
                console.log("✅ Recipe received:", data.title)

                return mapAIToRecipe(data)
            } else {
                const errorText = await response.text()
                console.error("❌ API Error:", response.status, errorText)
                try {
                    const errorJson = JSON.parse(errorText)
                    throw new Error(errorJson.error || "Unknown API Error")
                } catch (e) {
                    throw new Error(`API Error ${response.status}: ${errorText}`)
                }
            }
        } catch (e) {
            console.error("⚠️ Exception:", e)
            throw e
        }
    },
}

function processIngredients(ingredients: string[]): string[] {
    return ingredients
        .map((i) => i.trim().toLowerCase())
        .filter((i) => i.length > 0)
        .filter((val, index, self) => self.indexOf(val) === index) // Unique
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
        description: "AI-generated recipe using your selected ingredients",
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        steps: steps,
        cookingTimeMinutes: estimateCookingTime(steps),
        rating: 4.5, // Default rating for AI recipes
        servings: 2, // Default servings
        difficulty: "Medium",
        likesCount: 0,
        commentsCount: 0,
        cooksCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isSaved: false,
        comments: [],
    }
}

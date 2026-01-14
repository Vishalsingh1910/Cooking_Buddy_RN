export interface RecipeComment {
    id: string
    authorName: string
    authorImageUrl: string
    text: string
    createdAt: string
    likesCount: number
    isLiked: boolean
}

export interface Recipe {
    id: string
    title: string
    imageUrl: string
    authorName: string
    authorImageUrl: string
    authorUsername: string
    description: string
    ingredients: string[]
    steps: string[] // 'instructions' in some contexts, 'steps' in FLutter model
    cookingTimeMinutes: number
    rating: number
    servings: number
    difficulty: "Easy" | "Medium" | "Hard"
    calories?: number
    likesCount: number
    commentsCount: number
    cooksCount: number
    createdAt: string
    isLiked: boolean
    isSaved: boolean
    comments: RecipeComment[]
}

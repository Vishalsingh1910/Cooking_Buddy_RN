import { supabase } from "../supabase/supabase"

export interface UserProfile {
    id: string
    display_name: string
    photo_url: string | null
    bio: string | null
    created_at: string
    updated_at: string
}

export const UserService = {
    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single()

        if (error) {
            console.error("Error fetching user profile:", error)
            return null
        }

        return data
    },

    /**
     * Get current user's profile
     */
    async getCurrentUserProfile(): Promise<UserProfile | null> {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) return null

        return this.getUserProfile(session.user.id)
    },

    /**
     * Create or update user profile
     */
    async upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from("users")
            .upsert({
                id: profile.id,
                display_name: profile.display_name,
                photo_url: profile.photo_url,
                bio: profile.bio,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            console.error("Error upserting user profile:", error)
            return null
        }

        return data
    },

    /**
     * Create initial profile from auth metadata
     * Call this after user signs up
     */
    async createProfileFromAuth(): Promise<UserProfile | null> {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return null

        const user = session.user
        const metadata = user.user_metadata

        return this.upsertUserProfile({
            id: user.id,
            display_name: metadata?.display_name || metadata?.full_name || user.email?.split('@')[0] || 'Chef',
            photo_url: metadata?.photo_url || metadata?.avatar_url || null,
            bio: null,
        })
    },
}

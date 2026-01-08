export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  supabaseUrl: string
  supabaseAnonKey: string
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "dev",

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: "always",

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["Welcome"],
  supabaseUrl: "https://skffmwtflxujfnmztamq.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZmZtd3RmbHh1amZubXp0YW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzQ1MjksImV4cCI6MjA3NTc1MDUyOX0.9Wr0X_x3UUq0zK4yHXLL6wDBgKXBkbDH-NA5u4N0NLU"
}

export default BaseConfig

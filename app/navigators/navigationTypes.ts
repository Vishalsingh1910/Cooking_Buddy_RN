import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Recipe } from "@/models/Recipe"


// Demo Tab Navigator types
export type DemoTabParamList = {
  Home: undefined
  Recipes: undefined
  Chat: undefined
  Profile: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  ForgotPassword: undefined
  RecipeList: undefined
  RecipeDetail: { id: string; recipeData?: Recipe }
  AddRecipe: undefined
  MyRecipes: undefined
  Favorites: undefined
  Profile: undefined
  Settings: undefined
  EditProfile: undefined
  ChangePassword: undefined
  Notifications: undefined
  ThemePreferences: undefined
  Chat: undefined
  ChatDetail: { name: string; profileImage: string }
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> { }

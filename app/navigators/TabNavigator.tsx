import { TextStyle, ViewStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"

import { translate } from "@/i18n/translate"
import { ChatScreen } from "@/screens/ChatScreen"
import { RecipeListScreen } from "@/screens/RecipeListScreen"
import { FavoritesScreen } from "@/screens/FavoritesScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"

import type { TabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<TabParamList>()

/**
 * This is the main navigator for the app with a bottom tab bar.
 * Each tab is a screen or stack navigator.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `TabNavigator`.
 */
export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 60 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >


      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon={focused ? "home" : "homeOutline"}
              color={focused ? colors.tint : colors.tintInactive}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Recipes"
        component={RecipeListScreen}
        options={{
          tabBarLabel: "Recipes",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon={focused ? "restaurant" : "restaurantOutline"}
              color={focused ? colors.tint : colors.tintInactive}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon={focused ? "chatFilled" : "chat"}
              color={focused ? colors.tint : colors.tintInactive}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon={focused ? "person" : "personOutline"}
              color={focused ? colors.tint : colors.tintInactive}
              size={24}
            />
          ),
        }}
      />


    </Tab.Navigator>

  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})

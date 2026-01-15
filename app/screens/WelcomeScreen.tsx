import React, { FC, useRef, useState } from "react"
import {
  FlatList,
  ListRenderItemInfo,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import LottieView from "lottie-react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

interface WelcomOnboardingItemData {
  key: string
  title: string
  subtitle: string
  animation: any
  colorKey?: string
}

const DATA: WelcomOnboardingItemData[] = [
  {
    key: "1",
    title: "Discover Your Next Favorite Meal",
    subtitle: "Browse thousands of recipes from around the world, all in one place. Find exactly what you're craving.",
    animation: require("../../assets/lottie/cooking.json"),
    colorKey: "primary",
  },
  {
    key: "2",
    title: "Your Personal AI Chef",
    subtitle: "Get smart recipe suggestions based on ingredients you already have at home. Never waste food again!",
    animation: require("../../assets/lottie/ai-chef.json"),
    colorKey: "secondary",
  },
  {
    key: "3",
    title: "Cook, Share, Connect",
    subtitle: "Save your favorites, share your creations, and get inspired by a community of food lovers.",
    animation: require("../../assets/lottie/community.json"),
    colorKey: "primary",
  },
]

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { }

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(
  props,
) {
  const { themed, theme } = useAppTheme()
  const { navigation } = props

  const flatListRef = useRef<FlatList<WelcomOnboardingItemData> | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const insetsStyle = useSafeAreaInsetsStyle(["bottom"])

  function onNextPress() {
    if (currentIndex < DATA.length - 1) {
      const nextIndex = currentIndex + 1
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentIndex(nextIndex)
    } else {
      navigation.replace("Login")
    }
  }

  function onScrollToIndex(index: number) {
    flatListRef.current?.scrollToIndex({ index, animated: true })
    setCurrentIndex(index)
  }

  function renderItem({ item }: ListRenderItemInfo<WelcomOnboardingItemData>) {
    return (
      <View style={themed([$styles.pageContainer])}>
        <View style={themed($styles.illustrationContainer)}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={$styles.lottie}
          />
        </View>

        <Text preset="heading" style={themed($styles.title)}>
          {item.title}
        </Text>

        <Text style={themed($styles.subtitle)} size="md">
          {item.subtitle}
        </Text>
      </View>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($styles.container)}>
        {/* Skip Button */}
        <TouchableOpacity
          style={themed($styles.skipButton)}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.7}
        >
          <Text style={themed($styles.skipText)}>Skip</Text>
        </TouchableOpacity>

        <FlatList
          data={DATA}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          keyExtractor={(i) => i.key}
          renderItem={renderItem}
          onMomentumScrollEnd={(ev) => {
            const offsetX = ev.nativeEvent.contentOffset.x
            const pageIndex = Math.round(offsetX / SCREEN_WIDTH)
            setCurrentIndex(pageIndex)
          }}
        />

        <View style={themed([$styles.bottomPanel, insetsStyle])}>
          <View style={themed($styles.indicatorsRow)}>
            {DATA.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onScrollToIndex(i)}
                activeOpacity={0.8}
                style={themed(i === currentIndex ? $styles.activeIndicator : $styles.indicator)}
              />
            ))}
          </View>

          <View style={themed($styles.buttonWrapper)}>
            <Button
              testID="onboarding-next-button"
              tx={currentIndex === DATA.length - 1 ? "common:getStarted" : "common:next"}
              onPress={onNextPress}
              textStyle={themed($styles.buttonTextStyle)}
              style={themed($styles.ctaButton)}
              pressedStyle={themed($styles.ctaButton)}
            />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const $styles = {
  flex1: { flex: 1 } as ViewStyle,
  container: ({ colors }: any) =>
  ({
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle),
  skipButton: ({ spacing }: any) =>
  ({
    position: "absolute",
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  } as ViewStyle),
  skipText: ({ colors }: any) =>
  ({
    fontSize: 16,
    fontWeight: "600",
    color: colors.palette.neutral600,
  } as TextStyle),
  pageContainer: ({ spacing }: any) =>
  ({
    width: SCREEN_WIDTH,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  } as ViewStyle),
  illustrationContainer: ({ spacing, colors }: any) =>
  ({
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.palette.appPrimary + "20",
    marginBottom: spacing.xl,
    overflow: "hidden",
  } as ViewStyle),
  lottie: {
    width: 200,
    height: 200,
  } as ViewStyle,
  title: ({ spacing }: any) =>
  ({
    fontSize: 28,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: "center",
    paddingHorizontal: spacing.sm,
  } as TextStyle),
  subtitle: ({ spacing, colors }: any) =>
  ({
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: colors.palette.neutral600,
    paddingHorizontal: spacing.lg,
  } as TextStyle),

  bottomPanel: ({ colors, spacing }: any) =>
  ({
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  } as ViewStyle),

  indicatorsRow: ({ spacing }: any) =>
  ({
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  } as ViewStyle),

  indicator: ({ spacing, colors }: any) =>
  ({
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: 4,
    backgroundColor: colors.palette.neutral400,
    marginHorizontal: spacing.xxs,
  } as ViewStyle),

  activeIndicator: ({ spacing, colors }: any) =>
  ({
    width: 24,
    height: spacing.xs,
    borderRadius: 4,
    backgroundColor: colors.palette.appPrimary,
    marginHorizontal: spacing.xxs,
  } as ViewStyle),

  buttonWrapper: ({ spacing }: any) =>
  ({
    marginBottom: spacing.lg,
  } as ViewStyle),

  ctaButton: ({ colors }: any) =>
  ({
    borderRadius: 120,
    backgroundColor: colors.palette.appPrimary,
    borderWidth: 0,
  } as ViewStyle),

  buttonTextStyle: () =>
  ({
    fontSize: 20,
  } as TextStyle),
}

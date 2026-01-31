import React from "react"
import {
  Image,
  ImageStyle,
  ImageSourcePropType,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome,
  FontAwesome6,
  AntDesign,
} from "@expo/vector-icons"

type ImageEntry = { kind: "image"; src: ImageSourcePropType }
type VectorEntry = { kind: "vector"; pack: VectorPackKey; name: string }
type IconEntry = ImageEntry | VectorEntry

export type IconTypes = keyof typeof iconRegistry

type BaseIconProps = {
  icon: IconTypes
  color?: string
  size?: number
  style?: StyleProp<ImageStyle>
  containerStyle?: StyleProp<ViewStyle>
}

type PressableIconProps = Omit<TouchableOpacityProps, "style"> & BaseIconProps
type IconProps = Omit<ViewProps, "style"> & BaseIconProps

type VectorPackKey = "MaterialCommunityIcons" | "Ionicons" | "Feather" | "MaterialIcons" | "FontAwesome" | "FontAwesome6" | "AntDesign"

const VECTOR_PACKS: Record<VectorPackKey, any> = {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome,
  FontAwesome6,
  AntDesign,
}

export const iconRegistry = {
  back: { kind: "image", src: require("@assets/icons/back.png") },
  bell: { kind: "image", src: require("@assets/icons/bell.png") },
  caretLeft: { kind: "image", src: require("@assets/icons/caretLeft.png") },
  caretRight: { kind: "image", src: require("@assets/icons/caretRight.png") },
  check: { kind: "image", src: require("@assets/icons/check.png") },
  clap: { kind: "image", src: require("@assets/icons/demo/clap.png") },
  community: { kind: "image", src: require("@assets/icons/demo/community.png") },
  components: { kind: "image", src: require("@assets/icons/demo/components.png") },
  debug: { kind: "image", src: require("@assets/icons/demo/debug.png") },
  github: { kind: "image", src: require("@assets/icons/demo/github.png") },
  // heart: { kind: "image", src: require("@assets/icons/demo/heart.png") }, // Replaced with vector icon
  hidden: { kind: "image", src: require("@assets/icons/hidden.png") },
  ladybug: { kind: "image", src: require("@assets/icons/ladybug.png") },
  lock: { kind: "image", src: require("@assets/icons/lock.png") },
  menu: { kind: "image", src: require("@assets/icons/menu.png") },
  more: { kind: "image", src: require("@assets/icons/more.png") },
  pin: { kind: "image", src: require("@assets/icons/demo/pin.png") },
  podcast: { kind: "image", src: require("@assets/icons/demo/podcast.png") },
  settings: { kind: "image", src: require("@assets/icons/settings.png") },
  slack: { kind: "image", src: require("@assets/icons/demo/slack.png") },
  view: { kind: "image", src: require("@assets/icons/view.png") },
  x: { kind: "image", src: require("@assets/icons/x.png") },

  // Vector icons
  chef: { kind: "vector", pack: "MaterialCommunityIcons", name: "chef-hat" },
  robot: { kind: "vector", pack: "FontAwesome6", name: "robot" },
  users: { kind: "vector", pack: "Feather", name: "users" },
  google: { kind: "vector", pack: "AntDesign", name: "google" },
  share: { kind: "vector", pack: "MaterialCommunityIcons", name: "share-variant" },
  bookmark: { kind: "vector", pack: "MaterialCommunityIcons", name: "bookmark" },
  bookmarkOutline: { kind: "vector", pack: "MaterialCommunityIcons", name: "bookmark-outline" },
  heart: { kind: "vector", pack: "MaterialCommunityIcons", name: "heart" },
  heartOutline: { kind: "vector", pack: "MaterialCommunityIcons", name: "heart-outline" },
  chat: { kind: "vector", pack: "Ionicons", name: "chatbubble-outline" },
  clock: { kind: "vector", pack: "MaterialCommunityIcons", name: "clock-outline" },
  star: { kind: "vector", pack: "AntDesign", name: "star" },
  send: { kind: "vector", pack: "Ionicons", name: "send" },

  // Tab Icons (Flutter Parity)
  home: { kind: "vector", pack: "Ionicons", name: "home" },
  homeOutline: { kind: "vector", pack: "Ionicons", name: "home-outline" },
  restaurant: { kind: "vector", pack: "MaterialIcons", name: "restaurant-menu" },
  restaurantOutline: { kind: "vector", pack: "MaterialIcons", name: "restaurant-menu" }, // MaterialIcons might not have outline for this, using same for now or switch pack
  chatFilled: { kind: "vector", pack: "Ionicons", name: "chatbubble" },
  // chat already exists
  search: { kind: "vector", pack: "Ionicons", name: "search" },
  person: { kind: "vector", pack: "Ionicons", name: "person" },
  personOutline: { kind: "vector", pack: "Ionicons", name: "person-outline" },

  // Additional icons for AddRecipeScreen
  image: { kind: "vector", pack: "Ionicons", name: "image-outline" },
  camera: { kind: "vector", pack: "Ionicons", name: "camera-outline" },
  plus: { kind: "vector", pack: "Ionicons", name: "add-circle-outline" },

  // Profile section icons
  people: { kind: "vector", pack: "Ionicons", name: "people" },
  "person-add": { kind: "vector", pack: "Ionicons", name: "person-add" },
  help: { kind: "vector", pack: "Ionicons", name: "help-circle" },
} as const


function renderIcon(entry: IconEntry, size: number | undefined, color: string | undefined, imageStyle: StyleProp<ImageStyle>) {
  if (entry.kind === "image") {
    return <Image source={entry.src} style={[{ width: size, height: size, resizeMode: "contain", tintColor: color }, imageStyle]} />
  }
  const Pack = VECTOR_PACKS[entry.pack]
  const finalSize = size ?? 24
  const finalColor = color ?? undefined
  return <Pack name={entry.name} size={finalSize} color={finalColor} />
}

export function PressableIcon(props: PressableIconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...pressableProps
  } = props

  const { theme } = useAppTheme()

  const registryEntry = iconRegistry[icon] as IconEntry
  const finalColor = color ?? theme.colors.text
  const finalSize = size

  return (
    <TouchableOpacity {...pressableProps} style={$containerStyleOverride}>
      {renderIcon(registryEntry, finalSize, finalColor, $imageStyleOverride as ImageStyle)}
    </TouchableOpacity>
  )
}

export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...viewProps
  } = props

  const { theme } = useAppTheme()

  const registryEntry = iconRegistry[icon] as IconEntry
  const finalColor = color ?? theme.colors.text
  const finalSize = size

  return (
    <View {...viewProps} style={$containerStyleOverride}>
      {renderIcon(registryEntry, finalSize, finalColor, $imageStyleOverride as ImageStyle)}
    </View>
  )
}

import React from "react"
import { View, Image, ImageStyle, TextStyle, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "./Text"
import { colors, spacing, typography } from "../theme"

export interface ChatItem {
    profileImage: string
    name: string
    lastMessage: string
    timestamp: string
    isGroup: boolean
    unreadCount: number
    isOnline: boolean
}

interface ChatListItemProps {
    chat: ChatItem
    onPress?: (chat: ChatItem) => void
}

export function ChatListItem(props: ChatListItemProps) {
    const { chat, onPress } = props

    return (
        <TouchableOpacity style={$container} onPress={() => onPress?.(chat)}>
            {/* Profile Image with Online Indicator */}
            <View style={$imageContainer}>
                <Image source={{ uri: chat.profileImage }} style={$avatar} />
                {chat.isOnline && <View style={$onlineIndicator} />}
            </View>

            {/* Content */}
            <View style={$contentContainer}>
                <View style={$headerRow}>
                    <Text style={$name} text={chat.name} numberOfLines={1} />
                    <Text style={$timestamp} text={chat.timestamp} />
                </View>

                <View style={$messageRow}>
                    <Text
                        style={[$message, chat.unreadCount > 0 && $unreadMessage]}
                        text={chat.lastMessage}
                        numberOfLines={1}
                    />
                    {chat.unreadCount > 0 && (
                        <View style={$badge}>
                            <Text style={$badgeText} text={chat.unreadCount.toString()} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    backgroundColor: colors.background,
}

const $imageContainer: ViewStyle = {
    marginRight: spacing.md,
}

const $avatar: ImageStyle = {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.palette.neutral200,
}

const $onlineIndicator: ViewStyle = {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.palette.success, // Use theme success color or green
    borderWidth: 2,
    borderColor: colors.background,
}

const $contentContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
}

const $headerRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
}

const $name: TextStyle = {
    fontFamily: typography.primary.bold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginRight: spacing.xs,
}

const $timestamp: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
}

const $messageRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}

const $message: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    flex: 1,
    marginRight: spacing.sm,
}

const $unreadMessage: TextStyle = {
    color: colors.text,
    fontFamily: typography.primary.medium,
}

const $badge: ViewStyle = {
    backgroundColor: colors.palette.appPrimary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
}

const $badgeText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 10,
    fontWeight: "bold",
}

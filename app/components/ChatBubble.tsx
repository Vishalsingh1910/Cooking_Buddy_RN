import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { colors, spacing } from "../theme"

export interface Message {
    id: string
    content: string
    isFromCurrentUser: boolean
    timestamp: Date
    senderName?: string
}

interface ChatBubbleProps {
    message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
    const isMe = message.isFromCurrentUser

    return (
        <View style={[
            $container,
            isMe ? $containerMe : $containerOther
        ]}>
            <View style={[
                $bubble,
                isMe ? $bubbleMe : $bubbleOther
            ]}>
                <Text
                    style={[
                        $text,
                        isMe ? $textMe : $textOther
                    ]}
                    text={message.content}
                />
            </View>
        </View>
    )
}

const $container: ViewStyle = {
    marginBottom: spacing.xs,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
}

const $containerMe: ViewStyle = {
    justifyContent: "flex-end",
}

const $containerOther: ViewStyle = {
    justifyContent: "flex-start",
}

const $bubble: ViewStyle = {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
}

const $bubbleMe: ViewStyle = {
    backgroundColor: colors.palette.primary500,
    borderBottomRightRadius: 4,
}

const $bubbleOther: ViewStyle = {
    backgroundColor: colors.palette.secondary, // Using secondary as per Flutter logic roughly
    borderBottomLeftRadius: 4,
    opacity: 0.9,
}

const $text: TextStyle = {
    fontSize: 15,
    lineHeight: 22,
}

const $textMe: TextStyle = {
    color: colors.palette.neutral100,
}

const $textOther: TextStyle = {
    color: colors.palette.neutral800,
}

import React, { useState } from "react"
import { View, TextInput, ViewStyle, TouchableOpacity, TextStyle } from "react-native"
import { colors, spacing } from "../theme"
import { Icon } from "./Icon"

interface ChatInputBarProps {
    onSendMessage: (text: string) => void
}

export function ChatInputBar({ onSendMessage }: ChatInputBarProps) {
    const [text, setText] = useState("")

    const handleSend = () => {
        const trimmed = text.trim()
        if (trimmed.length > 0) {
            onSendMessage(trimmed)
            setText("")
        }
    }

    return (
        <View style={$container}>
            {/* Emoji Button Placeholder */}
            <TouchableOpacity style={$emojiButton} onPress={() => { }}>
                <Icon icon="star" size={20} color={colors.palette.neutral100} />
            </TouchableOpacity>

            <View style={$inputContainer}>
                <TextInput
                    style={$input}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.textDim}
                    value={text}
                    onChangeText={setText}
                    multiline
                />
            </View>

            <TouchableOpacity
                style={[$sendButton, !!text.trim() ? $sendButtonActive : $sendButtonInactive]}
                onPress={handleSend}
                disabled={!text.trim()}
            >
                <Icon icon="caretRight" size={24} color={!!text.trim() ? colors.palette.neutral100 : colors.textDim} />
            </TouchableOpacity>
        </View>
    )
}

const $container: ViewStyle = {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.palette.neutral100,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.palette.neutral200,
}

const $emojiButton: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.palette.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
}

const $inputContainer: ViewStyle = {
    flex: 1,
    backgroundColor: colors.palette.neutral300,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, // Adjust based on font size
    minHeight: 40,
    justifyContent: "center",
}

const $input: TextStyle = {
    fontSize: 16,
    color: colors.text,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 100,
}

const $sendButton: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
}

const $sendButtonActive: ViewStyle = {
    backgroundColor: colors.palette.primary500,
}

const $sendButtonInactive: ViewStyle = {
    backgroundColor: colors.palette.neutral300,
}

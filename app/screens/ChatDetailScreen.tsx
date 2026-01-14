import React, { FC, useState, useRef, useEffect } from "react"
import { View, ViewStyle, FlatList, KeyboardAvoidingView, Platform } from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { colors, spacing } from "@/theme"
import { ChatBubble, Message } from "@/components/ChatBubble"
import { ChatInputBar } from "@/components/ChatInputBar"

interface ChatDetailScreenProps extends AppStackScreenProps<"ChatDetail"> { }

export const ChatDetailScreen: FC<ChatDetailScreenProps> = ({ route, navigation }) => {
    const { name } = route.params
    const flatListRef = useRef<FlatList>(null)

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: name,
            headerTitleAlign: "center",
        })

        // Load static sample messages
        setMessages([
            {
                id: '1',
                content: 'Hey! How\'s your cooking going today?',
                isFromCurrentUser: false,
                timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                senderName: name,
            },
            {
                id: '2',
                content: 'Great! Just finished making that pasta recipe you shared 🍝',
                isFromCurrentUser: true,
                timestamp: new Date(Date.now() - 6300000),
            },
            {
                id: '3',
                content: 'Awesome! How did it turn out? Did you add the extra herbs?',
                isFromCurrentUser: false,
                timestamp: new Date(Date.now() - 5400000),
                senderName: name,
            },
            {
                id: '4',
                content: 'Yes! The basil made such a difference. Thanks for the tip!',
                isFromCurrentUser: true,
                timestamp: new Date(Date.now() - 1800000),
            },
        ])
    }, [navigation, name])


    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: text,
            isFromCurrentUser: true,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
        }
    }, [messages])

    return (
        <KeyboardAvoidingView
            style={$container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$contentContainer}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ChatBubble message={item} />}
                    contentContainerStyle={$listContent}
                />
                <ChatInputBar onSendMessage={handleSendMessage} />
            </Screen>
        </KeyboardAvoidingView>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $contentContainer: ViewStyle = {
    flex: 1,
}

const $listContent: ViewStyle = {
    paddingVertical: spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end', // Keeps messages at bottom if few
}

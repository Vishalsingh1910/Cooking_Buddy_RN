import React, { FC } from "react"
import { View, FlatList, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { colors, spacing, typography } from "@/theme"
import { ChatListItem, ChatItem } from "@/components/ChatListItem"
import { Icon } from "@/components/Icon"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> { }

const CHAT_DATA: ChatItem[] = [
    {
        profileImage: 'https://picsum.photos/50/50?random=1',
        name: 'Chef Maria Rodriguez',
        lastMessage: 'Thanks for trying my pasta recipe! 🍝',
        timestamp: '2m ago',
        isGroup: false,
        unreadCount: 2,
        isOnline: true,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=2',
        name: 'Vegetarian Recipes',
        lastMessage: 'Sarah: Just posted a new quinoa bowl recipe!',
        timestamp: '15m ago',
        isGroup: true,
        unreadCount: 5,
        isOnline: false,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=3',
        name: 'Gordon Ramsay',
        lastMessage: 'The secret is in the seasoning timing',
        timestamp: '1h ago',
        isGroup: false,
        unreadCount: 0,
        isOnline: false,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=4',
        name: 'Quick Meals',
        lastMessage: 'Mike: 15-minute dinner ideas anyone?',
        timestamp: '2h ago',
        isGroup: true,
        unreadCount: 12,
        isOnline: false,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=5',
        name: 'Julia Chen',
        lastMessage: 'Your dumplings look amazing! Recipe please? 🥟',
        timestamp: '3h ago',
        isGroup: false,
        unreadCount: 1,
        isOnline: true,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=6',
        name: 'Baking Masters',
        lastMessage: 'Emma: Sourdough starter tips in comments',
        timestamp: '5h ago',
        isGroup: true,
        unreadCount: 0,
        isOnline: false,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=7',
        name: 'Anthony Bourdain Fan',
        lastMessage: 'Just tried that Vietnamese pho recipe',
        timestamp: '1d ago',
        isGroup: false,
        unreadCount: 0,
        isOnline: false,
    },
    {
        profileImage: 'https://picsum.photos/50/50?random=8',
        name: 'Dessert Lovers',
        lastMessage: 'Lisa: Chocolate lava cake success! 🍫',
        timestamp: '2d ago',
        isGroup: true,
        unreadCount: 3,
        isOnline: false,
    },
]

export const ChatScreen: FC<ChatScreenProps> = ({ navigation }) => {

    const handleChatPress = (chat: ChatItem) => {
        navigation.navigate("ChatDetail", { name: chat.name, profileImage: chat.profileImage })
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            {/* Header matching Profile tab */}
            <View style={$header}>
                <Text style={$headerTitle}>Chat</Text>
            </View>

            <FlatList
                data={CHAT_DATA}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <ChatListItem chat={item} onPress={handleChatPress} />
                )}
                contentContainerStyle={$listContent}
            />
        </Screen>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center'
}

const $headerTitle: TextStyle = {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    color: colors.text,
}

const $listContent: ViewStyle = {
    paddingBottom: spacing.lg,
}

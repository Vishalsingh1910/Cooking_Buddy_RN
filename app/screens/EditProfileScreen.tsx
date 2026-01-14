import React, { FC, useState } from "react"
import {
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    ImageStyle,
    Alert,
} from "react-native"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { colors, spacing, typography } from "@/theme"
import { useAuth } from "@/context/AuthContext"
import * as ImagePicker from "expo-image-picker"

interface EditProfileScreenProps extends AppStackScreenProps<"EditProfile"> { }

export const EditProfileScreen: FC<EditProfileScreenProps> = ({ navigation }) => {
    const { session } = useAuth()
    const user = session?.user

    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
    const [bio, setBio] = useState("Home cook passionate about healthy, delicious meals. Love experimenting with Mediterranean and Asian cuisines! 🍳✨")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [avatarUri, setAvatarUri] = useState(user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=200")
    const [isSaving, setIsSaving] = useState(false)

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access camera roll is required!")
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access camera is required!")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    const handleImagePicker = () => {
        Alert.alert(
            "Change Profile Picture",
            "Choose an option",
            [
                { text: "Take Photo", onPress: takePhoto },
                { text: "Choose from Library", onPress: pickImage },
                { text: "Cancel", style: "cancel" },
            ]
        )
    }

    const handleSave = async () => {
        setIsSaving(true)

        // TODO: Implement profile update logic with Supabase
        // This would include:
        // 1. Upload avatar image to storage if changed
        // 2. Update user metadata in Supabase auth
        // 3. Update user profile in database

        setTimeout(() => {
            setIsSaving(false)
            Alert.alert("Success", "Profile updated successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ])
        }, 1000)
    }

    return (
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
            <View style={$header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
                    <Icon icon="back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={$headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                    <Text style={[$saveText, isSaving && $saveTextDisabled]}>
                        {isSaving ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={$avatarSection}>
                    <TouchableOpacity onPress={handleImagePicker} style={$avatarContainer}>
                        <Image source={{ uri: avatarUri }} style={$avatar} />
                        <View style={$avatarOverlay}>
                            <Icon icon="camera" size={24} color={colors.palette.neutral100} />
                            <Text style={$avatarOverlayText}>Change Photo</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={$formSection}>
                    <View style={$inputGroup}>
                        <Text style={$label}>Full Name</Text>
                        <TextInput
                            style={$input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.textDim}
                        />
                    </View>

                    <View style={$inputGroup}>
                        <Text style={$label}>Bio</Text>
                        <TextInput
                            style={[$input, $textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            placeholderTextColor={colors.textDim}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        <Text style={$charCount}>{bio.length}/200</Text>
                    </View>

                    <View style={$inputGroup}>
                        <Text style={$label}>Email</Text>
                        <TextInput
                            style={[$input, $inputDisabled]}
                            value={email}
                            editable={false}
                            placeholderTextColor={colors.textDim}
                        />
                        <Text style={$helperText}>Email cannot be changed</Text>
                    </View>

                    <View style={$inputGroup}>
                        <Text style={$label}>Phone Number</Text>
                        <TextInput
                            style={$input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor={colors.textDim}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={$inputGroup}>
                        <Text style={$label}>Location</Text>
                        <TextInput
                            style={$input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="City, Country"
                            placeholderTextColor={colors.textDim}
                        />
                    </View>
                </View>

                <View style={$bottomSpacer} />
            </ScrollView>
        </Screen>
    )
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $header: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
}

const $backButton: ViewStyle = {
    width: 40,
}

const $headerTitle: TextStyle = {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    color: colors.text,
}

const $saveText: TextStyle = {
    fontSize: 16,
    fontWeight: "600",
    color: colors.palette.appPrimary,
}

const $saveTextDisabled: TextStyle = {
    color: colors.textDim,
}

const $avatarSection: ViewStyle = {
    alignItems: "center",
    paddingVertical: spacing.lg,
}

const $avatarContainer: ViewStyle = {
    position: "relative",
}

const $avatar: ImageStyle = {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.palette.appPrimary,
}

const $avatarOverlay: ViewStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
}

const $avatarOverlayText: TextStyle = {
    color: colors.palette.neutral100,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
}

const $formSection: ViewStyle = {
    paddingHorizontal: spacing.md,
}

const $inputGroup: ViewStyle = {
    marginBottom: spacing.lg,
}

const $label: TextStyle = {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
}

const $input: TextStyle = {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
}

const $inputDisabled: TextStyle = {
    backgroundColor: colors.palette.neutral200,
    color: colors.textDim,
}

const $textArea: ViewStyle = {
    minHeight: 100,
    paddingTop: spacing.md,
}

const $charCount: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    textAlign: "right",
    marginTop: spacing.xs,
}

const $helperText: TextStyle = {
    fontSize: 12,
    color: colors.textDim,
    marginTop: spacing.xs,
}

const $bottomSpacer: ViewStyle = {
    height: spacing.xl,
}

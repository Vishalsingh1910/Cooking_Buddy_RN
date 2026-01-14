import React, { FC, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { RecipeService } from "@/services/api/RecipeService"
import { useAppTheme } from "@/theme/context"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import * as ImagePicker from "expo-image-picker"

interface AddRecipeScreenProps extends AppStackScreenProps<"AddRecipe"> { }

export const AddRecipeScreen: FC<AddRecipeScreenProps> = ({ navigation }) => {
    const { themed, theme } = useAppTheme()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [cookingTime, setCookingTime] = useState("")
    const [ingredients, setIngredients] = useState([""])
    const [steps, setSteps] = useState([""])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== "granted") {
                Alert.alert("Permission needed", "Please grant camera roll permissions to select an image.")
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            })

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri)
            }
        } catch (error) {
            console.error("Error picking image:", error)
            Alert.alert("Error", "Failed to pick image")
        }
    }

    const addIngredient = () => {
        setIngredients([...ingredients, ""])
    }

    const removeIngredient = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index))
        }
    }

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = value
        setIngredients(newIngredients)
    }

    const addStep = () => {
        setSteps([...steps, ""])
    }

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index))
        }
    }

    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps]
        newSteps[index] = value
        setSteps(newSteps)
    }

    const validateForm = (): boolean => {
        if (!title.trim()) {
            Alert.alert("Validation Error", "Please enter a recipe title")
            return false
        }
        if (!description.trim()) {
            Alert.alert("Validation Error", "Please enter a description")
            return false
        }
        if (!cookingTime.trim() || isNaN(Number(cookingTime))) {
            Alert.alert("Validation Error", "Please enter a valid cooking time in minutes")
            return false
        }

        const validIngredients = ingredients.filter(i => i.trim())
        if (validIngredients.length === 0) {
            Alert.alert("Validation Error", "Please add at least one ingredient")
            return false
        }

        const validSteps = steps.filter(s => s.trim())
        if (validSteps.length === 0) {
            Alert.alert("Validation Error", "Please add at least one cooking step")
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            const validIngredients = ingredients.filter(i => i.trim())
            const validSteps = steps.filter(s => s.trim())

            const recipeData = {
                title: title.trim(),
                description: description.trim(),
                cookingTimeMinutes: Number(cookingTime),
                ingredients: validIngredients,
                steps: validSteps,
                difficulty: "Medium" as const,
            }

            await RecipeService.createRecipeWithImage(recipeData, selectedImage || undefined)

            Alert.alert(
                "Success! 🎉",
                "Your recipe has been added successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            )
        } catch (error) {
            console.error("Error creating recipe:", error)
            Alert.alert("Error", "Failed to create recipe. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Screen preset="fixed" contentContainerStyle={themed($screenContainer)} safeAreaEdges={["top"]}>
            <View style={themed($header)}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={themed($backButton)}>
                    <Icon icon="back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text preset="heading" text="Add Recipe" />
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={themed($scrollView)}
                contentContainerStyle={themed($scrollContent)}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Picker */}
                <View style={themed($section)}>
                    <TouchableOpacity onPress={pickImage} style={themed($imagePicker)}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={themed($selectedImage)} />
                        ) : (
                            <View style={themed($imagePlaceholder)}>
                                <Icon icon="image" size={48} color={theme.colors.textDim} />
                                <Text text="Add Photo" style={themed($imagePlaceholderText)} />
                            </View>
                        )}
                    </TouchableOpacity>
                    {selectedImage && (
                        <TouchableOpacity onPress={pickImage} style={themed($changePhotoButton)}>
                            <Icon icon="camera" size={20} color={theme.colors.palette.primary500} />
                            <Text text="Change Photo" style={themed($changePhotoText)} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Basic Info */}
                <View style={themed($section)}>
                    <Text preset="subheading" text="Basic Information" style={themed($sectionTitle)} />

                    <Text text="Title *" style={themed($label)} />
                    <TextInput
                        style={themed($input)}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter recipe title"
                        placeholderTextColor={theme.colors.textDim}
                    />

                    <Text text="Description *" style={themed($label)} />
                    <TextInput
                        style={themed([$input, $textArea])}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Describe your recipe"
                        placeholderTextColor={theme.colors.textDim}
                        multiline
                        numberOfLines={4}
                    />

                    <Text text="Cooking Time (minutes) *" style={themed($label)} />
                    <TextInput
                        style={themed($input)}
                        value={cookingTime}
                        onChangeText={setCookingTime}
                        placeholder="e.g., 30"
                        placeholderTextColor={theme.colors.textDim}
                        keyboardType="numeric"
                    />
                </View>

                {/* Ingredients */}
                <View style={themed($section)}>
                    <View style={themed($sectionHeader)}>
                        <Text preset="subheading" text="Ingredients" style={themed($sectionTitle)} />
                        <TouchableOpacity onPress={addIngredient} style={themed($addButton)}>
                            <Icon icon="plus" size={20} color={theme.colors.palette.primary500} />
                        </TouchableOpacity>
                    </View>

                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={themed($dynamicFieldRow)}>
                            <TextInput
                                style={themed([$input, $dynamicInput])}
                                value={ingredient}
                                onChangeText={(value) => updateIngredient(index, value)}
                                placeholder={`Ingredient ${index + 1}`}
                                placeholderTextColor={theme.colors.textDim}
                            />
                            {ingredients.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => removeIngredient(index)}
                                    style={themed($removeButton)}
                                >
                                    <Icon icon="x" size={20} color={theme.colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                {/* Steps */}
                <View style={themed($section)}>
                    <View style={themed($sectionHeader)}>
                        <Text preset="subheading" text="Cooking Steps" style={themed($sectionTitle)} />
                        <TouchableOpacity onPress={addStep} style={themed($addButton)}>
                            <Icon icon="plus" size={20} color={theme.colors.palette.primary500} />
                        </TouchableOpacity>
                    </View>

                    {steps.map((step, index) => (
                        <View key={index} style={themed($dynamicFieldRow)}>
                            <TextInput
                                style={themed([$input, $dynamicInput, $textArea])}
                                value={step}
                                onChangeText={(value) => updateStep(index, value)}
                                placeholder={`Step ${index + 1}`}
                                placeholderTextColor={theme.colors.textDim}
                                multiline
                                numberOfLines={2}
                            />
                            {steps.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => removeStep(index)}
                                    style={themed($removeButton)}
                                >
                                    <Icon icon="x" size={20} color={theme.colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={themed([$submitButton, isLoading && $submitButtonDisabled])}
                >
                    {isLoading ? (
                        <View style={themed($loadingContainer)}>
                            <ActivityIndicator color={theme.colors.palette.neutral100} size="small" />
                            <Text text="Adding Recipe..." style={themed($submitButtonText)} />
                        </View>
                    ) : (
                        <Text text="Add Recipe" style={themed($submitButtonText)} />
                    )}
                </TouchableOpacity>
            </ScrollView>
        </Screen>
    )
}

const $screenContainer = ({ spacing }: any) => ({
    flex: 1,
    paddingHorizontal: spacing.lg,
} as ViewStyle)

const $header = ({ spacing }: any) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.sm,
} as ViewStyle)

const $backButton = ({ spacing }: any) => ({
    padding: spacing.xs,
} as ViewStyle)

const $scrollView = () => ({
    flex: 1,
} as ViewStyle)

const $scrollContent = ({ spacing }: any) => ({
    paddingBottom: spacing.xxl,
} as ViewStyle)

const $section = ({ spacing }: any) => ({
    marginBottom: spacing.lg,
} as ViewStyle)

const $sectionTitle = ({ spacing }: any) => ({
    marginBottom: spacing.sm,
} as TextStyle)

const $sectionHeader = () => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
} as ViewStyle)

const $imagePicker = ({ spacing, colors }: any) => ({
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.palette.neutral200,
    borderWidth: 2,
    borderColor: colors.palette.neutral300,
    borderStyle: "dashed",
} as ViewStyle)

const $selectedImage = () => ({
    width: "100%",
    height: "100%",
} as ImageStyle)

const $imagePlaceholder = ({ colors }: any) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
} as ViewStyle)

const $imagePlaceholderText = ({ spacing, colors }: any) => ({
    marginTop: spacing.xs,
    color: colors.textDim,
} as TextStyle)

const $changePhotoButton = ({ spacing }: any) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
} as ViewStyle)

const $changePhotoText = ({ colors }: any) => ({
    color: colors.palette.primary500,
    fontWeight: "600",
} as TextStyle)

const $label = ({ spacing, colors }: any) => ({
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    color: colors.text,
    fontWeight: "600",
} as TextStyle)

const $input = ({ spacing, colors, typography }: any) => ({
    borderWidth: 1,
    borderColor: colors.palette.neutral300,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    fontFamily: typography.primary.normal,
    color: colors.text,
    backgroundColor: colors.palette.neutral100,
} as TextStyle)

const $textArea = () => ({
    minHeight: 80,
    textAlignVertical: "top",
} as TextStyle)

const $addButton = ({ spacing }: any) => ({
    padding: spacing.xs,
} as ViewStyle)

const $dynamicFieldRow = ({ spacing }: any) => ({
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    gap: spacing.xs,
} as ViewStyle)

const $dynamicInput = () => ({
    flex: 1,
} as TextStyle)

const $removeButton = ({ spacing }: any) => ({
    padding: spacing.xs,
    marginTop: spacing.xs,
} as ViewStyle)

const $submitButton = ({ spacing, colors }: any) => ({
    backgroundColor: colors.palette.primary500,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
} as ViewStyle)

const $submitButtonDisabled = ({ colors }: any) => ({
    backgroundColor: colors.palette.neutral400,
} as ViewStyle)

const $submitButtonText = ({ colors, typography }: any) => ({
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: typography.primary.medium,
} as TextStyle)

const $loadingContainer = ({ spacing }: any) => ({
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
} as ViewStyle)

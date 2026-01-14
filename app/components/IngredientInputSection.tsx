import React, { useState } from "react"
import { View, ViewStyle, TextStyle, StyleProp, TouchableOpacity, ScrollView } from "react-native"
import { TextField } from "./TextField"
import { Icon } from "./Icon"
import { Text } from "./Text"
import { Button } from "./Button"
import { useAppTheme } from "@/theme/context"

export interface IngredientInputSectionProps {
    style?: StyleProp<ViewStyle>
    onGenerateRecipe: (ingredients: string[]) => void
    isGenerating?: boolean
}

export const IngredientInputSection = (props: IngredientInputSectionProps) => {
    const { style, onGenerateRecipe, isGenerating = false } = props
    const { themed, theme } = useAppTheme()
    const [ingredientText, setIngredientText] = useState("")
    const [ingredients, setIngredients] = useState<string[]>([])

    const handleAddIngredient = () => {
        if (!ingredientText.trim()) return

        // Split by comma if user pastes a list
        const newIngredients = ingredientText
            .split(",")
            .map(i => i.trim())
            .filter(i => i.length > 0)

        // Add unique ingredients
        const uniqueNew = newIngredients.filter(i => !ingredients.includes(i))
        if (uniqueNew.length > 0) {
            setIngredients([...ingredients, ...uniqueNew])
            setIngredientText("")
        }
    }

    const removeIngredient = (index: number) => {
        const updated = [...ingredients]
        updated.splice(index, 1)
        setIngredients(updated)
    }

    const handleGenerate = () => {
        if (ingredients.length > 0) {
            onGenerateRecipe(ingredients)
        }
    }

    const quickAdd = (name: string) => {
        if (!ingredients.includes(name)) {
            setIngredients([...ingredients, name])
        }
    }

    return (
        <View style={[themed($container), style]}>
            <Text text="Find Recipes with AI" preset="subheading" style={{ marginBottom: theme.spacing.sm }} />

            {/* Input Area */}
            <View style={themed($inputRow)}>
                <TextField
                    value={ingredientText}
                    onChangeText={setIngredientText}
                    placeholder="Enter ingredients (e.g. Chicken, Tomato)"
                    containerStyle={{ flex: 1 }}
                    onSubmitEditing={handleAddIngredient}
                    RightAccessory={(props) => (
                        <TouchableOpacity onPress={handleAddIngredient} style={props.style}>
                            <Icon icon="plus" color={theme.colors.palette.primary500} size={24} />
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Chip List */}
            <View style={themed($chipContainer)}>
                {ingredients.map((ing, index) => (
                    <View key={`${ing}-${index}`} style={themed($chip)}>
                        <Text text={ing} style={themed($chipText)} />
                        <TouchableOpacity onPress={() => removeIngredient(index)}>
                            <Icon icon="x" size={14} color={theme.colors.palette.primary500} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                ))}
                {ingredients.length === 0 && (
                    <Text text="No ingredients added yet." size="xs" style={{ color: theme.colors.textDim, fontStyle: "italic" }} />
                )}
            </View>

            {/* Quick Add Suggestions */}
            {ingredients.length === 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={themed($suggestionScrollView)}
                    contentContainerStyle={themed($suggestionContainer)}
                >
                    {["Chicken", "Pasta", "Tomato", "Cheese", "Garlic", "Onion"].map(item => (
                        <TouchableOpacity key={item} onPress={() => quickAdd(item)} style={themed($suggestionChip)}>
                            <Text text={`+ ${item}`} size="xs" style={{ color: theme.colors.palette.primary500 }} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Generate Button */}
            <Button
                text={isGenerating ? "Generating..." : "Generate Recipe"}
                preset="reversed"
                onPress={handleGenerate}
                disabled={ingredients.length === 0 || isGenerating}
                style={{ marginTop: theme.spacing.md }}
                LeftAccessory={(props) => !isGenerating ? <Icon icon="robot" color={props.style.tintColor} size={20} style={props.style} /> : null}
            />
        </View>
    )
}

const $container = ({ colors, spacing, border }: any) => ({
    backgroundColor: colors.palette.neutral100,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.sm, // 8px
    marginBottom: spacing.sm,
    //   borderWidth: 1,
    //   borderColor: colors.palette.neutral300,
    ...{
        shadowColor: colors.palette.neutral900,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    }
} as ViewStyle)

const $inputRow = ({ spacing }: any) => ({
    flexDirection: "row",
    alignItems: "center",
} as ViewStyle)

const $chipContainer = ({ spacing }: any) => ({
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
} as ViewStyle)

const $chip = ({ colors, spacing }: any) => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.palette.primary100,
    borderRadius: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.palette.primary300,
} as ViewStyle)

const $chipText = ({ colors }: any) => ({
    color: colors.palette.primary600,
    fontSize: 12,
    fontWeight: "500",
} as TextStyle)

const $suggestionScrollView = ({ spacing }: any) => ({
    marginTop: spacing.xs,
} as ViewStyle)

const $suggestionContainer = ({ spacing }: any) => ({
    paddingRight: spacing.lg,
} as ViewStyle)

const $suggestionChip = ({ colors, spacing }: any) => ({
    marginRight: spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.palette.neutral200,
})

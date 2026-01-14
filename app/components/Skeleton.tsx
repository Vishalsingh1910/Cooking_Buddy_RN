import React, { useEffect, useRef } from "react"
import { Animated, ViewStyle, StyleProp, View } from "react-native"
import { colors } from "@/theme/colors"

export interface SkeletonProps {
    width?: number | string
    height?: number | string
    borderRadius?: number
    style?: StyleProp<ViewStyle>
}

export function Skeleton(props: SkeletonProps) {
    const { width, height, borderRadius = 8, style } = props
    const opacity = useRef(new Animated.Value(0.3)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1.0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()

        return () => pulse.stop()
    }, [opacity])

    const $style: ViewStyle = {
        width: width as any,
        height: height as any,
        borderRadius,
        backgroundColor: "#D1D5DB", // Visible gray
        opacity,
    }

    return <Animated.View style={[$style, style]} />
}

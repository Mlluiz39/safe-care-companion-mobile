import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../constants/colors'

type ButtonProps = {
  title: string
  onPress?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

const Button = ({
  title,
  onPress,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      opacity: disabled || loading ? 0.5 : 1,
    }

    const sizeStyles: Record<typeof size, ViewStyle> = {
      default: { height: 40, paddingHorizontal: 16 },
      sm: { height: 36, paddingHorizontal: 12 },
      lg: { height: 48, paddingHorizontal: 32 },
    }

    const variantStyles: Record<typeof variant, ViewStyle> = {
      default: { backgroundColor: colors.primary.DEFAULT },
      destructive: { backgroundColor: colors.destructive.DEFAULT },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.input,
      },
      secondary: { backgroundColor: colors.secondary.DEFAULT },
    }

    return [baseStyle, sizeStyles[size], variantStyles[variant], style].filter(Boolean) as ViewStyle[]
  }

  const getTextStyle = (): TextStyle[] => {
    const sizeStyles: Record<typeof size, TextStyle> = {
      default: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
      sm: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
      lg: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
    }

    const variantStyles: Record<typeof variant, TextStyle> = {
      default: { color: colors.primary.foreground },
      destructive: { color: colors.destructive.foreground },
      outline: { color: colors.foreground },
      secondary: { color: colors.secondary.foreground },
    }

    return [sizeStyles[size], variantStyles[variant]]
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  )
}

export default Button

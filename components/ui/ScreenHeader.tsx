import { View, Text, StyleSheet } from 'react-native'
import Button from './Button'
import { colors, fontSize, fontWeight, spacing } from '../../constants/colors'

type ScreenHeaderProps = {
  title: string
  buttonLabel?: string
  onButtonPress?: () => void
}

export default function ScreenHeader({
  title,
  buttonLabel,
  onButtonPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {buttonLabel && (
        <Button title={buttonLabel} onPress={onButtonPress} size="sm" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
})

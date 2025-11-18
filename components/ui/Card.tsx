import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, colorsWithOpacity, borderRadius } from '../../constants/colors'

type CardProps = React.ComponentProps<typeof View> & {
  style?: ViewStyle
}

const Card = ({ style, ...props }: CardProps) => (
  <View style={[styles.card, style]} {...props} />
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colorsWithOpacity['border/50'],
    borderRadius: borderRadius['2xl'],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
})

export default Card

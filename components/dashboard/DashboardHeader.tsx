import { View, Text, Image, StyleSheet } from 'react-native'
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
} from '../../constants/colors'

export default function DashboardHeader() {
  // Mock data, substituir com dados do usuário
  const userName = 'Maria de Fatima'

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá, {userName} !</Text>
        <Text style={styles.subtitle}>Cuide da sua família</Text>
      </View>
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${userName}` }}
        style={styles.avatar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
  },
})

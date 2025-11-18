import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from 'lucide-react-native'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { colors, fontSize, fontWeight, spacing } from '../../constants/colors'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <User size={48} color={colors.muted.foreground} />
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Gerencie sua conta</Text>
      <Button title="Sair" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.md,
    color: colors.foreground,
  },
  subtitle: {
    color: colors.muted.foreground,
    marginTop: spacing.sm,
    marginBottom: spacing.lg * 2,
  },
})

import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useFocusEffect } from 'expo-router'
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { usePatient } from '../../context/PatientContext'
import { useAuth } from '../../lib/auth'
import { useRouter } from 'expo-router'

export default function DashboardHeader() {
  const { currentPatient } = usePatient()
  const { user, profile } = useAuth()
  const router = useRouter()

  // Get user name from metadata or fallback to email
  const userName = profile?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  const patientName = currentPatient?.name || 'Selecione'
  const avatarUrl = profile?.avatar_url


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Erro ao sair', error.message)
    }
  }

  const handleSwitchPatient = () => {
    router.push('/patient/select')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSwitchPatient} style={styles.leftSection}>
        <View>
          <Text style={styles.greeting} numberOfLines={1}>Olá, {userName}</Text>
          <View style={styles.patientInfo}>
            <Text style={styles.subtitle} numberOfLines={1}>
              Cuidando de: <Text style={styles.patientName}>{patientName}</Text>
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted.foreground} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Image
          source={{ uri: avatarUrl || `https://i.pravatar.cc/150?u=${userName}` }}
          style={styles.avatar}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leftSection: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    flexShrink: 1,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
    flexShrink: 1,
  },
  patientName: {
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
  },
})

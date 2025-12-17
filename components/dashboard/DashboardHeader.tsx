import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useState, useCallback } from 'react'
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
  const { user } = useAuth()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Get user name from metadata or fallback to email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  const patientName = currentPatient?.name || 'Selecione'

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchAvatar()
      }
    }, [user])
  )

  const fetchAvatar = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user!.id)
        .single()

      if (data?.avatar_url) {
        const { data: imageData } = await supabase.storage
          .from('avatars')
          .createSignedUrl(data.avatar_url, 3600) // Create signed URL valid for 1 hour

        if (imageData?.signedUrl) {
          setAvatarUrl(imageData.signedUrl)
        }
      }
    } catch (error) {
      console.log('Error fetching avatar:', error)
    }
  }

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
      <TouchableOpacity onPress={handleSwitchPatient}>
        <View>
          <Text style={styles.greeting}>Olá, {userName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Text style={styles.subtitle}>Cuidando de: <Text style={{ fontWeight: 'bold', color: colors.primary.DEFAULT }}>{patientName}</Text></Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted.foreground} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color={colors.foreground} />
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
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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

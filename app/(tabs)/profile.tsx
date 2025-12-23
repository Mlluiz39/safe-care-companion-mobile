import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { colors, fontSize, fontWeight, spacing } from '../../constants/colors'

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // Ignore "no row found" error
        console.warn(error)
      }

      if (data) {
        setUsername(data.username || '')
        if (data.avatar_url) await downloadImage(data.avatar_url)
      }
    } catch (error) {
      console.log('Error loading profile:', error)
    }
  }

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
      if (error) {
        throw error
      }
      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  async function uploadImage() {
    try {
      setUploading(true)

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return
      }

      const image = result.assets[0]
      if (!image.base64) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user on the session!')

      const filePath = `${user.id}/${new Date().getTime()}.png`
      const contentType = 'image/png'

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(image.base64), { contentType })

      if (uploadError) {
        throw uploadError
      }

      const updates = {
        id: user.id,
        avatar_url: filePath,
        updated_at: new Date(),
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates)

      if (updateError) {
        throw updateError
      }

      await downloadImage(filePath)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro ao atualizar foto', error.message)
      }
    } finally {
      setUploading(false)
    }
  }

  // Helper to decode base64 for Supabase upload
  function decode(base64: string) {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.primary.DEFAULT}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={colors.muted.foreground} />
          </View>
        )}

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={uploadImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="camera" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{username || 'Usuário'}</Text>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <Text style={styles.infoText}>Gerencie suas informações pessoais</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.muted.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.DEFAULT,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  infoSection: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
    color: colors.foreground,
  },
  infoText: {
    color: colors.muted.foreground,
  },
})

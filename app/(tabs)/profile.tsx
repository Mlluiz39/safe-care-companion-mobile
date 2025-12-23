import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { colors, fontSize, fontWeight, spacing } from '../../constants/colors'
import { usePatient } from '../../context/PatientContext'
import * as Clipboard from 'expo-clipboard'

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  // Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')

  const { currentPatient } = usePatient()

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        setUsername(data.username || '')
        setEditName(data.username || '')
        if (data.avatar_url) await downloadImage(data.avatar_url)
      }
      
      setEditEmail(user.email || '')
    } catch (error) {
      console.log('Error loading profile:', error)
    }
  }

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error
      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => setAvatarUrl(fr.result as string)
    } catch (error) {
      console.log('Error downloading image: ', error)
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

      if (result.canceled || !result.assets || result.assets.length === 0) return

      const image = result.assets[0]
      if (!image.base64) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user on the session!')

      const filePath = `${user.id}/${new Date().getTime()}.png`
      const contentType = 'image/png'

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(image.base64), { contentType })

      if (uploadError) throw uploadError

      const updates = {
        id: user.id,
        avatar_url: filePath,
        updated_at: new Date(),
      }

      const { error: updateError } = await supabase.from('profiles').upsert(updates)
      if (updateError) throw updateError

      await downloadImage(filePath)
    } catch (error: any) {
      Alert.alert('Erro ao atualizar foto', error.message)
    } finally {
      setUploading(false)
    }
  }

  function decode(base64: string) {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update Username
      if (editName !== username) {
        const { error } = await supabase
          .from('profiles')
          .update({ username: editName, updated_at: new Date() })
          .eq('id', user.id)
        
        if (error) throw error
        setUsername(editName)
      }

      // Update Email/Password
      const attrs: { email?: string, password?: string } = {}
      if (editEmail !== user.email) attrs.email = editEmail
      if (editPassword) attrs.password = editPassword

      if (Object.keys(attrs).length > 0) {
        const { error } = await supabase.auth.updateUser(attrs)
        if (error) throw error
        if (attrs.email) Alert.alert('Verifique seu email', 'Um link de confirmação foi enviado para o novo email.')
      }

      setIsEditing(false)
      setEditPassword('')
      Alert.alert('Sucesso', 'Perfil atualizado!')
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (currentPatient?.invite_code || currentPatient?.id) {
        await Clipboard.setStringAsync(currentPatient.invite_code || currentPatient.id)
        Alert.alert('Copiado!', 'Código do paciente copiado para a área de transferência.')
    } else {
        Alert.alert('Erro', 'Nenhum paciente selecionado.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Editar Informações</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text style={styles.editLink}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
                </TouchableOpacity>
            </View>

            {isEditing ? (
                <View style={styles.editForm}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Nome"
                    />
                    
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={editEmail}
                        onChangeText={setEditEmail}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Nova Senha (deixe em branco para manter)</Text>
                    <TextInput
                        style={styles.input}
                        value={editPassword}
                        onChangeText={setEditPassword}
                        placeholder="Nova Senha"
                        secureTextEntry
                    />

                    <TouchableOpacity 
                        style={styles.saveButton} 
                        onPress={handleUpdateProfile}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.infoText}>Visualize e altere suas informações clicando em editar.</Text>
                </View>
            )}
        </View>

        {currentPatient && (
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Compartilhar Paciente</Text>
                <Text style={styles.infoText}>Envie este código para que cuidadores adicionem este paciente.</Text>
                
                <TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
                    <Text style={styles.codeText}>{currentPatient.invite_code || currentPatient.id}</Text>
                    <Ionicons name="copy-outline" size={20} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  editLink: {
    color: colors.primary.DEFAULT,
    fontWeight: fontWeight.medium,
  },
  editForm: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  saveButton: {
    backgroundColor: colors.primary.DEFAULT,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: fontWeight.bold,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    fontFamily: 'monospace',
  },
})

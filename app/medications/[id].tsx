import { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { updateMedication, deleteMedication } from '../../lib/medications'
import { cancelMedicationNotifications } from '../../lib/notifications'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { supabase } from '../../lib/supabase'

export default function EditMedicationScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [description, setDescription] = useState('')
  
  useEffect(() => {
    fetchMedication()
  }, [id])

  async function fetchMedication() {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setName(data.name)
      setDosage(data.dosage)
      setFrequency(data.frequency)
      setDescription(data.notes || '')
    } catch (error) {
      console.error('Error fetching medication:', error)
      Alert.alert('Erro', 'Não foi possível carregar os dados.')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!name.trim() || !dosage.trim() || !frequency.trim()) {
      Alert.alert('Erro', 'Nome, Dosagem e Frequência são obrigatórios.')
      return
    }

    try {
      await updateMedication(id as string, {
        name,
        dosage,
        frequency,
        notes: description,
      })

      Alert.alert('Sucesso', 'Medicamento atualizado!')
      router.back()
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Falha ao atualizar.')
    }
  }

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este medicamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelMedicationNotifications(id as string)
              await deleteMedication(id as string)
              router.back()
            } catch (e: any) {
              Alert.alert('Erro', e.message ?? 'Falha ao excluir.')
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Editar Medicamento" />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do medicamento"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Dosagem (ex: 50mg)"
          value={dosage}
          onChangeText={setDosage}
        />

        <TextInput
          style={styles.input}
          placeholder="Frequência (ex: 8 em 8 horas)"
          value={frequency}
          onChangeText={setFrequency}
        />

        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Observações (opcional)"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Excluir Medicamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  largeInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary.DEFAULT,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.destructive.DEFAULT,
    marginTop: spacing.lg,
  },
  deleteButtonText: {
    color: colors.destructive.DEFAULT,
  },
})

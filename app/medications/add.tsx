import { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { addMedication } from '../../lib/medications'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'

export default function AddMedicationScreen() {
  const router = useRouter()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome do medicamento é obrigatório.')
      return
    }

    try {
      await addMedication({
        name,
        dosage,
        description,
        start_date: new Date().toISOString(),
        user_id: user!.id,
        patient_id: user!.id, // ou id do paciente real
      })

      Alert.alert('Sucesso', 'Medicamento cadastrado!')
      router.back()
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Falha ao salvar medicamento.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Adicionar Medicamento" />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do medicamento"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Dosagem"
          value={dosage}
          onChangeText={setDosage}
        />

        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Observações (opcional)"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
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
})

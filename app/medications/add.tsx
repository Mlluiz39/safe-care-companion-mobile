import { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { addMedication } from '../../lib/medications'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import DateTimePicker from '../../components/ui/DateTimePicker'

import { usePatient } from '../../context/PatientContext'
import { registerForPushNotificationsAsync, scheduleMedicationNotification } from '../../lib/notifications'

export default function AddMedicationScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentPatient } = usePatient()

  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [description, setDescription] = useState('')
  const [remindMe, setRemindMe] = useState(false)
  const [alarmTime, setAlarmTime] = useState(() => {
    const now = new Date()
    now.setHours(8, 0, 0, 0)
    return now
  })

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim() || !frequency.trim()) {
      Alert.alert('Erro', 'Nome, Dosagem e Frequência são obrigatórios.')
      return
    }

    if (!currentPatient) {
      Alert.alert('Erro', 'Selecione um paciente antes de adicionar.')
      return
    }

    try {
      await addMedication({
        name,
        dosage,
        frequency,
        notes: description,
        start_date: new Date().toISOString(),
        user_id: user!.id,
        patient_id: currentPatient.id,
      })

      if (remindMe) {
        const hours = alarmTime.getHours().toString().padStart(2, '0')
        const minutes = alarmTime.getMinutes().toString().padStart(2, '0')
        const timeString = `${hours}:${minutes}`
        
        await scheduleMedicationNotification(
          'temp-id',
          name,
          dosage,
          timeString
        )
      }

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

        <DateTimePicker
          value={alarmTime}
          onChange={setAlarmTime}
          mode="time"
          label="Horário do Alarme"
        />

        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Observações (opcional)"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Lembrar-me</Text>
          <Switch
            trackColor={{ false: "#767577", true: colors.primary.DEFAULT }}
            thumbColor={remindMe ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={setRemindMe}
            value={remindMe}
          />
        </View>

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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 10,
  },
  switchLabel: {
    fontSize: fontSize.base,
    color: colors.foreground,
    fontWeight: '500',
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

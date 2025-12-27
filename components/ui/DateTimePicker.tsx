import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Speech from 'expo-speech'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/colors'

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  mode?: 'date' | 'time' | 'datetime'
  label?: string
  enableVoice?: boolean
  showQuickActions?: boolean
}

const STORAGE_KEY = '@frequent_times'
const PRESET_TIMES = [
  { label: '8h', hours: 8, minutes: 0 },
  { label: '12h', hours: 12, minutes: 0 },
  { label: '18h', hours: 18, minutes: 0 },
  { label: '20h', hours: 20, minutes: 0 },
]

export default function DateTimePicker({
  value,
  onChange,
  mode = 'datetime',
  label,
  enableVoice = true,
  showQuickActions = true,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(value)
  const [frequentTimes, setFrequentTimes] = useState<string[]>([])

  useEffect(() => {
    loadFrequentTimes()
  }, [])

  const loadFrequentTimes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFrequentTimes(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading frequent times:', error)
    }
  }

  const saveFrequentTime = async (time: string) => {
    try {
      const updated = [time, ...frequentTimes.filter(t => t !== time)].slice(0, 3)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setFrequentTimes(updated)
    } catch (error) {
      console.error('Error saving frequent time:', error)
    }
  }

  const speakDateTime = (date: Date) => {
    if (!enableVoice) return

    let text = ''
    if (mode === 'date' || mode === 'datetime') {
      const day = date.getDate()
      const month = date.toLocaleDateString('pt-BR', { month: 'long' })
      const year = date.getFullYear()
      text += `${day} de ${month} de ${year}`
    }
    if (mode === 'datetime') text += ', às '
    if (mode === 'time' || mode === 'datetime') {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      text += `${hours} horas`
      if (minutes > 0) text += ` e ${minutes} minutos`
    }

    Speech.speak(text, { language: 'pt-BR', rate: 0.85 })
  }

  const playSound = () => {
    if (enableVoice) {
      Speech.speak('', { language: 'pt-BR' }) // Quick beep effect
    }
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const formatDateTime = (date: Date) => {
    if (mode === 'date') return formatDate(date)
    if (mode === 'time') return formatTime(date)
    return `${formatDate(date)} às ${formatTime(date)}`
  }

  const handleConfirm = () => {
    onChange(tempDate)
    if (mode === 'time' || mode === 'datetime') {
      saveFrequentTime(formatTime(tempDate))
    }
    speakDateTime(tempDate)
    setShowPicker(false)
  }

  const handleCancel = () => {
    setTempDate(value)
    setShowPicker(false)
  }

  const setToday = () => {
    const today = new Date()
    today.setHours(tempDate.getHours(), tempDate.getMinutes(), 0, 0)
    setTempDate(today)
    playSound()
  }

  const setTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(tempDate.getHours(), tempDate.getMinutes(), 0, 0)
    setTempDate(tomorrow)
    playSound()
  }

  const setPresetTime = (hours: number, minutes: number) => {
    const newDate = new Date(tempDate)
    newDate.setHours(hours, minutes, 0, 0)
    setTempDate(newDate)
    playSound()
  }

  const setFrequentTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    setPresetTime(hours, minutes)
  }

  const adjustDate = (field: 'day' | 'month' | 'year', delta: number) => {
    const newDate = new Date(tempDate)
    if (field === 'day') newDate.setDate(newDate.getDate() + delta)
    if (field === 'month') newDate.setMonth(newDate.getMonth() + delta)
    if (field === 'year') newDate.setFullYear(newDate.getFullYear() + delta)
    setTempDate(newDate)
    playSound()
  }

  const adjustTime = (field: 'hour' | 'minute', delta: number) => {
    const newDate = new Date(tempDate)
    if (field === 'hour') newDate.setHours(newDate.getHours() + delta)
    if (field === 'minute') newDate.setMinutes(newDate.getMinutes() + delta)
    setTempDate(newDate)
    playSound()
  }

  const renderQuickDateActions = () => {
    if (!showQuickActions || mode === 'time') return null

    return (
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Atalhos Rápidos</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionButton} onPress={setToday}>
            <Ionicons name="today-outline" size={20} color={colors.primary.DEFAULT} />
            <Text style={styles.quickActionText}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={setTomorrow}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary.DEFAULT} />
            <Text style={styles.quickActionText}>Amanhã</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderQuickTimeActions = () => {
    if (!showQuickActions || mode === 'date') return null

    return (
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Horários Comuns</Text>
        <View style={styles.quickActionsGrid}>
          {PRESET_TIMES.map((preset) => (
            <TouchableOpacity
              key={preset.label}
              style={styles.quickTimeButton}
              onPress={() => setPresetTime(preset.hours, preset.minutes)}
            >
              <Text style={styles.quickTimeText}>{preset.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {frequentTimes.length > 0 && (
          <>
            <Text style={[styles.quickActionsTitle, { marginTop: spacing.md }]}>
              Horários Frequentes
            </Text>
            <View style={styles.quickActionsGrid}>
              {frequentTimes.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickTimeButton, styles.frequentTimeButton]}
                  onPress={() => setFrequentTime(time)}
                >
                  <Ionicons name="time" size={16} color={colors.secondary.DEFAULT} />
                  <Text style={styles.quickTimeText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    )
  }

  const renderDatePicker = () => (
    <View style={styles.pickerSection}>
      <Text style={styles.sectionTitle}>Data</Text>
      <View style={styles.pickerRow}>
        {/* Day */}
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Dia</Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('day', 1)}
          >
            <Ionicons name="chevron-up" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{tempDate.getDate().toString().padStart(2, '0')}</Text>
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('day', -1)}
          >
            <Ionicons name="chevron-down" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        {/* Month */}
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Mês</Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('month', 1)}
          >
            <Ionicons name="chevron-up" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {(tempDate.getMonth() + 1).toString().padStart(2, '0')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('month', -1)}
          >
            <Ionicons name="chevron-down" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        {/* Year */}
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Ano</Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('year', 1)}
          >
            <Ionicons name="chevron-up" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{tempDate.getFullYear()}</Text>
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustDate('year', -1)}
          >
            <Ionicons name="chevron-down" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderTimePicker = () => (
    <View style={styles.pickerSection}>
      <Text style={styles.sectionTitle}>Horário</Text>
      <View style={styles.pickerRow}>
        {/* Hour */}
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Hora</Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustTime('hour', 1)}
          >
            <Ionicons name="chevron-up" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {tempDate.getHours().toString().padStart(2, '0')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustTime('hour', -1)}
          >
            <Ionicons name="chevron-down" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        {/* Minute */}
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Minuto</Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustTime('minute', 5)}
          >
            <Ionicons name="chevron-up" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {tempDate.getMinutes().toString().padStart(2, '0')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => adjustTime('minute', -5)}
          >
            <Ionicons name="chevron-down" size={32} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.inputButton}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
          size={24}
          color={colors.primary.DEFAULT}
        />
        <Text style={styles.inputText}>{formatDateTime(value)}</Text>
        <Ionicons name="chevron-down" size={24} color={colors.muted.foreground} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'date' ? 'Selecionar Data' : mode === 'time' ? 'Selecionar Horário' : 'Selecionar Data e Hora'}
              </Text>
              {enableVoice && (
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={() => speakDateTime(tempDate)}
                >
                  <Ionicons name="volume-high" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.pickerContainer}>
              {renderQuickDateActions()}
              {renderQuickTimeActions()}
              {(mode === 'date' || mode === 'datetime') && renderDatePicker()}
              {(mode === 'time' || mode === 'datetime') && renderTimePicker()}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputText: {
    flex: 1,
    fontSize: fontSize.lg,
    color: colors.foreground,
    fontWeight: fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '85%',
  },
  modalHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    textAlign: 'center',
    flex: 1,
  },
  voiceButton: {
    padding: spacing.sm,
  },
  pickerContainer: {
    padding: spacing.lg,
  },
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  quickActionsTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.muted.foreground,
    marginBottom: spacing.sm,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
  },
  quickActionText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary.DEFAULT,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickTimeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  frequentTimeButton: {
    borderColor: colors.secondary.DEFAULT,
  },
  quickTimeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  pickerSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.md,
  },
  pickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  arrowButton: {
    padding: spacing.sm,
  },
  valueContainer: {
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    minWidth: 80,
    borderWidth: 2,
    borderColor: colors.primary.DEFAULT,
  },
  valueText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.muted.DEFAULT,
  },
  confirmButton: {
    backgroundColor: colors.primary.DEFAULT,
  },
  cancelButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.muted.foreground,
  },
  confirmButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
})

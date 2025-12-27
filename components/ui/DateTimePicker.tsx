import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/colors'

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  mode?: 'date' | 'time' | 'datetime'
  label?: string
}

export default function DateTimePicker({
  value,
  onChange,
  mode = 'datetime',
  label,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(value)

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
    setShowPicker(false)
  }

  const handleCancel = () => {
    setTempDate(value)
    setShowPicker(false)
  }

  const adjustDate = (field: 'day' | 'month' | 'year', delta: number) => {
    const newDate = new Date(tempDate)
    if (field === 'day') newDate.setDate(newDate.getDate() + delta)
    if (field === 'month') newDate.setMonth(newDate.getMonth() + delta)
    if (field === 'year') newDate.setFullYear(newDate.getFullYear() + delta)
    setTempDate(newDate)
  }

  const adjustTime = (field: 'hour' | 'minute', delta: number) => {
    const newDate = new Date(tempDate)
    if (field === 'hour') newDate.setHours(newDate.getHours() + delta)
    if (field === 'minute') newDate.setMinutes(newDate.getMinutes() + delta)
    setTempDate(newDate)
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
            </View>

            <ScrollView style={styles.pickerContainer}>
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
    maxHeight: '80%',
  },
  modalHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    textAlign: 'center',
  },
  pickerContainer: {
    padding: spacing.lg,
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

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card'
import { Medication } from '../../types'
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'

type MedicationListItemProps = {
  medication: Medication
  onPress?: () => void
}

export default function MedicationListItem({
  medication,
  onPress,
}: MedicationListItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="medkit" size={24} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {medication.name}
          </Text>
          <Text style={styles.info}>{medication.dosage}</Text>
          <Text style={styles.info}>Frequência: {medication.frequency}</Text>
          {medication.patient && (
            <Text style={styles.info}>Paciente: {medication.patient.name}</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colorsWithOpacity['primary/10'],
    padding: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  info: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
  },
})

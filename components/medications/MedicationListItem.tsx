import { View, Text, StyleSheet } from 'react-native'
import { Pill } from 'lucide-react-native'
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
}

export default function MedicationListItem({
  medication,
}: MedicationListItemProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <Pill size={24} color={colors.primary.DEFAULT} />
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

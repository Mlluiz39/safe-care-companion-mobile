import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card'
import { Appointment } from '../../types'
import { format } from 'date-fns'
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'

type AppointmentListItemProps = {
  appointment: Appointment
  onPress?: () => void
}

export default function AppointmentListItem({
  appointment,
  onPress,
}: AppointmentListItemProps) {
  const appointmentDate = new Date(appointment.date)
  const formattedTime = format(appointmentDate, 'HH:mm')

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Text style={styles.specialty}>
              {appointment.specialty.charAt(0).toUpperCase() +
                appointment.specialty.slice(1).toLowerCase()}
            </Text>
            <Text style={styles.doctor}>{appointment.doctor}</Text>
            {appointment.patient && (
              <Text style={styles.patient}>
                Paciente: {appointment.patient.name}
              </Text>
            )}
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.time}>{formattedTime}</Text>
            <Text style={styles.date}>
              {format(appointmentDate, 'dd/MM/yy')}
            </Text>
          </View>
        </View>
        {appointment.location && (
          <>
            <View style={styles.divider} />
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.muted.foreground}
                style={styles.locationIcon}
              />
              <Text style={styles.location}>{appointment.location}</Text>
            </View>
          </>
        )}
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  specialty: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.secondary.foreground,
    backgroundColor: colorsWithOpacity['secondary/90'],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  doctor: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  patient: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginVertical: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: spacing.sm,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
    flex: 1,
  },
})

import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Medication } from '../../types'
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useEffect, useState } from 'react'
import { startOfToday, endOfToday } from 'date-fns'

export default function TodayMedications() {
  const { user } = useAuth()
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTodayMedications = async () => {
      if (!user) return

      setLoading(true)
      const todayStart = startOfToday().toISOString()
      const todayEnd = endOfToday().toISOString()

      const { data, error } = await supabase
        .from('medications')
        .select('*, patient:patients(*)')
        .eq('user_id', user.id)
        .gte('start_date', todayStart)
        .lte('start_date', todayEnd)
        .order('start_date', { ascending: true })

      if (error) {
        console.error('Erro ao buscar medicamentos de hoje:', error)
      } else {
        setMedications(data || [])
      }
      setLoading(false)
    }

    fetchTodayMedications()
  }, [user])

  const renderItem = ({ item }: { item: Medication }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit" size={24} color={colors.primary.DEFAULT} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.medicationName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.medicationInfo}>{item.dosage}</Text>
            <Text style={styles.medicationInfo}>
              Frequência: {item.frequency}
            </Text>
            {item.patient && (
              <Text style={styles.medicationInfo}>
                Paciente: {item.patient.name}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Button title="Confirmar" size="sm" />
        </View>
      </View>
    </Card>
  )

  if (loading) {
    return (
      <View>
        <Text style={styles.title}>Medicamentos de Hoje</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      </View>
    )
  }

  if (medications.length === 0) {
    return null
  }

  return (
    <View>
      <Text style={styles.title}>Medicamentos de Hoje</Text>
      <FlatList
        data={medications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    padding: spacing.md,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconContainer: {
    backgroundColor: colorsWithOpacity['primary/10'],
    padding: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  medicationInfo: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
  },
  rightSection: {
    alignItems: 'center',
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  separator: {
    width: spacing.md,
  },
})

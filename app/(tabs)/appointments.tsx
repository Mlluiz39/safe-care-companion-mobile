import {
  SectionList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { Appointment } from '../../types'
import AppointmentListItem from '../../components/appointments/AppointmentListItem'
import { colors, fontSize, fontWeight, spacing } from '../../constants/colors'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useEffect, useState } from 'react'

export default function AppointmentsScreen() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return

      setLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Erro ao buscar consultas:', error)
        alert('Não foi possível carregar as consultas.')
      } else {
        setAppointments(data || [])
      }
      setLoading(false)
    }

    fetchAppointments()
  }, [user])

  const now = new Date()
  const upcoming = appointments
    .filter(apt => new Date(apt.date) >= now && apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const past = appointments
    .filter(apt => new Date(apt.date) < now || apt.status !== 'scheduled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const APPOINTMENT_SECTIONS = [
    {
      title: 'Próximas Consultas',
      data: upcoming,
    },
    {
      title: 'Consultas Anteriores',
      data: past,
    },
  ]

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Minhas Consultas"
          buttonLabel="Agendar"
          onButtonPress={() => alert('Agendar nova consulta')}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Minhas Consultas"
        buttonLabel="Agendar"
        onButtonPress={() => alert('Agendar nova consulta')}
      />
      <SectionList
        sections={APPOINTMENT_SECTIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <AppointmentListItem appointment={item} />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={styles.listHeader} />}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma consulta encontrada.</Text>
          ) : null
        }
      />
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
  itemWrapper: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: 12,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  listHeader: {
    height: 8,
  },
  itemSeparator: {
    height: spacing.md,
  },
  sectionSeparator: {
    height: spacing.lg,
  },
  emptyText: {
    color: colors.muted.foreground,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
})

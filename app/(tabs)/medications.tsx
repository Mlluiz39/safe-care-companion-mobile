import { FlatList, View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { Medication } from '../../types'
import MedicationListItem from '../../components/medications/MedicationListItem'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { colors, spacing, fontSize } from '../../constants/colors'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { usePatient } from '../../context/PatientContext'

export default function MedicationsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentPatient } = usePatient() // Added hook
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const fetchMedications = async () => {
        if (!user || !currentPatient) return // Check for patient

        // loading spinner only on first load could be better, but acceptable here
        setLoading(true)
        const { data, error } = await supabase
          .from('medications')
          .select('*, patient:patients(*)')
          .eq('patient_id', currentPatient.id) // Filter by Patient ID
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro ao buscar medicamentos:', error)
          // Optional: Don't alert on every focus if error persists, or handle gracefully
        } else {
          setMedications(data || [])
        }
        setLoading(false)
      }

      fetchMedications()
    }, [user, currentPatient]) // Added dep
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Meus Remédios"
          buttonLabel="Adicionar"
          onButtonPress={() => router.push('/medications/add')}
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
        title="Meus Remédios"
        buttonLabel="Adicionar"
        onButtonPress={() => router.push('/medications/add')}
      />
      <FlatList
        data={medications}
        renderItem={({ item }) => <MedicationListItem medication={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum medicamento cadastrado.
            </Text>
            <Text style={styles.emptySubtext}>
              Clique em "Adicionar" para começar.
            </Text>
          </View>
        )}
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.muted.foreground,
  },
  emptySubtext: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
    marginTop: spacing.sm,
  },
})

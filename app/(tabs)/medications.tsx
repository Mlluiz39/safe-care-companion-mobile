import { FlatList, View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { Medication } from '../../types'
import MedicationListItem from '../../components/medications/MedicationListItem'
import { useRouter } from 'expo-router'
import { colors, spacing, fontSize } from '../../constants/colors'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useEffect, useState } from 'react'

export default function MedicationsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return

      setLoading(true)
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar medicamentos:', error)
        alert('Não foi possível carregar os medicamentos.')
      } else {
        setMedications(data || [])
      }
      setLoading(false)
    }

    fetchMedications()
  }, [user])

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

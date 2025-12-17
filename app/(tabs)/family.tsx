import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useCallback, useState } from 'react'
import { FamilyMember } from '../../types'
import FamilyMemberCard from '../../components/family/FamilyMemberCard'
import { useAuth } from '../../lib/auth'
import { colors, fontSize, spacing } from '../../constants/colors'

import { usePatient } from '../../context/PatientContext'

export default function FamilyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentPatient } = usePatient()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const fetchFamilyMembers = async () => {
        if (!user || !currentPatient) return

        setLoading(true)
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('patient_id', currentPatient.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro ao buscar familiares:', error)
          // alert('Não foi possível carregar os familiares.')
        } else {
          setFamilyMembers(data || [])
        }
        setLoading(false)
      }

      fetchFamilyMembers()
    }, [user, currentPatient])
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Meus Familiares"
        buttonLabel="Adicionar"
        onButtonPress={() => router.push('/family/add')}
      />
      <FlatList
        data={familyMembers}
        renderItem={({ item }) => <FamilyMemberCard member={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum familiar cadastrado.
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
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

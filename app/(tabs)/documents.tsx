import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { Document } from '../../types'
import DocumentGridItem from '../../components/documents/DocumentGridItem'
import { colors, spacing, fontSize } from '../../constants/colors'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useCallback, useState } from 'react'

import { usePatient } from '../../context/PatientContext'

export default function DocumentsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentPatient } = usePatient()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const fetchDocuments = async () => {
        if (!user || !currentPatient) return

        setLoading(true)
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('patient_id', currentPatient.id)
          .order('date', { ascending: false })

        if (error) {
          console.error('Erro ao buscar documentos:', error)
          // alert('Não foi possível carregar os documentos.')
        } else {
          setDocuments(data || [])
        }
        setLoading(false)
      }

      fetchDocuments()
    }, [user, currentPatient])
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Meus Exames"
          buttonLabel="Adicionar"
          onButtonPress={() => router.push('/documents/add')}
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
        title="Meus Exames"
        buttonLabel="Adicionar"
        onButtonPress={() => router.push('/documents/add')}
      />
      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <DocumentGridItem
            document={item}
            onPress={() => router.push(`/documents/${item.id}` as any)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum documento cadastrado.
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
    paddingHorizontal: 18,
    paddingBottom: spacing.lg,
  },
  columnWrapper: {
    gap: 12,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    width: '100%',
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

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
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useEffect, useState } from 'react'

export default function DocumentsScreen() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return

      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*, patient:patients(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Erro ao buscar documentos:', error)
        alert('Não foi possível carregar os documentos.')
      } else {
        setDocuments(data || [])
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [user])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Meus Exames"
          buttonLabel="Adicionar"
          onButtonPress={() => alert('Adicionar novo exame')}
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
        onButtonPress={() => alert('Adicionar novo exame')}
      />
      <FlatList
        data={documents}
        renderItem={({ item }) => <DocumentGridItem document={item} />}
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

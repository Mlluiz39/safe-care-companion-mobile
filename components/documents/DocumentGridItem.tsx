import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card'
import { Document } from '../../types'
import { format } from 'date-fns'
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'

type DocumentGridItemProps = {
  document: Document
  onPress?: () => void
}

export default function DocumentGridItem({ document, onPress }: DocumentGridItemProps) {
  const documentDate = new Date(document.date)
  const formattedDate = format(documentDate, 'dd/MM/yyyy')

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={24} color={colors.accent.foreground} />
          </View>
          {document.file_url && (
            <Pressable
              onPress={() => alert('Baixar documento')}
              style={styles.downloadButton}
            >
              <Ionicons name="download-outline" size={24} color={colors.accent.foreground} />
            </Pressable>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {document.title}
          </Text>
          {document.patient && (
            <Text style={styles.info}>Paciente: {document.patient.name}</Text>
          )}
          <Text style={styles.info}>Data: {formattedDate}</Text>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: colorsWithOpacity['accent/10'],
    padding: 12,
    borderRadius: borderRadius.full,
  },
  downloadButton: {
    padding: 4,
  },
  content: {
    marginTop: 12,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  info: {
    fontSize: fontSize.sm,
    color: colors.muted.foreground,
    marginTop: 4,
  },
})

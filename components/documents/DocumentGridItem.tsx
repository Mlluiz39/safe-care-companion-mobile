import { View, Text, Pressable, StyleSheet } from 'react-native'
import { FileText, Download } from 'lucide-react-native'
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
}

export default function DocumentGridItem({ document }: DocumentGridItemProps) {
  const documentDate = new Date(document.date)
  const formattedDate = format(documentDate, 'dd/MM/yyyy')

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={24} color={colors.accent.DEFAULT} />
        </View>
        {document.file_url && (
          <Pressable
            onPress={() => alert('Baixar documento')}
            style={styles.downloadButton}
          >
            <Download size={20} color={colors.muted.foreground} />
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

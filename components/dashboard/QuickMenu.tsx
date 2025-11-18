import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Pill, Calendar, FileText, Users } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'

const menuItems = [
  {
    title: 'Remédios',
    icon: Pill,
    color: colors.primary.DEFAULT,
    bgColor: colorsWithOpacity['primary/10'],
    href: '/medications',
  },
  {
    title: 'Consultas',
    icon: Calendar,
    color: colors.secondary.DEFAULT,
    bgColor: colorsWithOpacity['secondary/10'],
    href: '/appointments',
  },
  {
    title: 'Exames',
    icon: FileText,
    color: colors.accent.DEFAULT,
    bgColor: colorsWithOpacity['accent/10'],
    href: '/documents',
  },
  {
    title: 'Familiares',
    icon: Users,
    color: '#3B82F6', // blue-500
    bgColor: colorsWithOpacity['blue-500/10'],
    href: '/family',
  },
]

export default function QuickMenu() {
  const router = useRouter()

  return (
    <View>
      <Text style={styles.title}>Menu Rápido</Text>
      <View style={styles.grid}>
        {menuItems.map(item => (
          <Pressable
            key={item.title}
            style={styles.menuItem}
            onPress={() => router.push(item.href as any)}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: item.bgColor }]}
            >
              <item.icon size={32} color={item.color} />
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorsWithOpacity['border/50'],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginTop: 12,
  },
})

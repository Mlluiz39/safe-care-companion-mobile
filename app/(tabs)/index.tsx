import { ScrollView, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import QuickMenu from '../../components/dashboard/QuickMenu'
import TodayMedications from '../../components/dashboard/TodayMedications'
import { colors, spacing } from '../../constants/colors'

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <DashboardHeader />
        </View>
        <View style={styles.menuSection}>
          <QuickMenu />
        </View>
        <View style={styles.medicationsSection}>
          <TodayMedications />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  menuSection: {
    marginTop: spacing.lg * 2,
    paddingHorizontal: spacing.lg,
  },
  medicationsSection: {
    marginTop: spacing.lg * 2,
  },
})

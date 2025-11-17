import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import QuickMenu from "../../components/dashboard/QuickMenu";
import TodayMedications from "../../components/dashboard/TodayMedications";

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-4">
          <DashboardHeader />
        </View>
        <View className="mt-8 px-6">
          <QuickMenu />
        </View>
        <View className="mt-8">
          <TodayMedications />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

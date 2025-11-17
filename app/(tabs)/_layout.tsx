import { Tabs } from "expo-router";
import { Home, Pill, Calendar, FileText, User, Users } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "hsl(185 70% 45%)",
        tabBarInactiveTintColor: "hsl(215.4 16.3% 46.9%)",
        tabBarStyle: {
          backgroundColor: "hsl(0 0% 100%)",
          borderTopWidth: 1,
          borderTopColor: "hsl(214.3 31.8% 91.4%)",
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Home size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: "Remédios",
          tabBarIcon: ({ color }) => <Pill size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Consultas",
          tabBarIcon: ({ color }) => <Calendar size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: "Exames",
          tabBarIcon: ({ color }) => <FileText size={26} color={color} />,
        }}
      />
       <Tabs.Screen
        name="family"
        options={{
          title: "Familiares",
          tabBarIcon: ({ color }) => <Users size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { View, Text, Pressable } from "react-native";
import { Pill, Calendar, FileText, Users } from "lucide-react-native";
import { useRouter } from "expo-router";

const menuItems = [
  {
    title: "Remédios",
    icon: Pill,
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/medications",
  },
  {
    title: "Consultas",
    icon: Calendar,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    href: "/appointments",
  },
  {
    title: "Exames",
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/documents",
  },
  {
    title: "Familiares",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/family",
  },
];

export default function QuickMenu() {
  const router = useRouter();

  return (
    <View>
      <Text className="text-lg font-bold text-foreground mb-4">Menu Rápido</Text>
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item) => (
          <Pressable
            key={item.title}
            className="w-[48%] bg-card rounded-2xl p-4 mb-4 items-center shadow-sm border border-border/50"
            onPress={() => router.push(item.href as any)}
          >
            <View className={`w-16 h-16 rounded-full justify-center items-center ${item.bgColor}`}>
              <item.icon size={32} className={item.color} />
            </View>
            <Text className="text-base font-semibold text-foreground mt-3">{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

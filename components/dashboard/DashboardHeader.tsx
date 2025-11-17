import { View, Text, Image } from "react-native";

export default function DashboardHeader() {
  // Mock data, substituir com dados do usuário
  const userName = "Maria";

  return (
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-2xl font-bold text-foreground">Olá, {userName}!</Text>
        <Text className="text-base text-muted-foreground">Cuide da sua família</Text>
      </View>
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${userName}` }}
        className="w-14 h-14 rounded-full"
      />
    </View>
  );
}

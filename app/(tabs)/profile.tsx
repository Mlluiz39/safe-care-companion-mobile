import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "lucide-react-native";
import Button from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <User size={48} className="text-muted-foreground" />
      <Text className="text-xl font-bold mt-4 text-foreground">Perfil</Text>
      <Text className="text-muted-foreground mt-2 mb-8">Gerencie sua conta</Text>
      <Button title="Sair" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}

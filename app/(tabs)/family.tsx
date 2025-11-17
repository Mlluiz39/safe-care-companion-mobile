import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { FamilyMember } from "../../types";
import FamilyMemberCard from "../../components/family/FamilyMemberCard";
import { useAuth } from "../../lib/auth";

export default function FamilyScreen() {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar familiares:", error);
        alert("Não foi possível carregar os familiares.");
      } else {
        setFamilyMembers(data);
      }
      setLoading(false);
    };

    fetchFamilyMembers();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="hsl(185 70% 45%)" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Meus Familiares"
        buttonLabel="Adicionar"
        onButtonPress={() => alert("Adicionar novo familiar")}
      />
      <FlatList
        data={familyMembers}
        renderItem={({ item }) => <FamilyMemberCard member={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-lg text-muted-foreground">Nenhum familiar cadastrado.</Text>
                <Text className="text-base text-muted-foreground mt-2">Clique em "Adicionar" para começar.</Text>
            </View>
        )}
      />
    </SafeAreaView>
  );
}

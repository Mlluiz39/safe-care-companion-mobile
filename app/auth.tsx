import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import { Heart } from "lucide-react-native";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center items-center bg-background p-8">
      <View className="absolute inset-0 bg-primary/5"></View>
      
      <View className="w-full max-w-sm">
        <View className="items-center mb-10">
          <Heart size={64} className="text-primary" fill="hsl(185 70% 45%)" />
          <Text className="text-3xl font-bold text-foreground mt-4">Cuidado com a Saúde</Text>
          <Text className="text-base text-muted-foreground mt-2">Entre para continuar</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-base font-medium text-foreground mb-2">Email</Text>
            <TextInput
              className="bg-input border border-border rounded-md h-12 px-4 text-base text-foreground"
              onChangeText={setEmail}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Text className="text-base font-medium text-foreground mb-2">Senha</Text>
            <TextInput
              className="bg-input border border-border rounded-md h-12 px-4 text-base text-foreground"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              placeholder="Sua senha"
              autoCapitalize="none"
            />
          </View>
        </View>

        <Pressable
          className="bg-primary rounded-md h-12 justify-center items-center mt-8 active:opacity-80"
          onPress={signInWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground text-base font-bold">Entrar</Text>
          )}
        </Pressable>
        
        <Text className="text-center text-muted-foreground mt-8">
          Não tem uma conta? <Text className="text-primary font-semibold">Cadastre-se</Text>
        </Text>
      </View>
    </View>
  );
}

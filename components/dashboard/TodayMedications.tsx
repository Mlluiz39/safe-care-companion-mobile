import { View, Text, FlatList } from "react-native";
import { faker } from "@faker-js/faker";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Medication } from "../../types";
import { Pill } from "lucide-react-native";

// Gerar dados fictícios
const createRandomMedication = (): Medication => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName().replace(/\s(Shoes|Shirt|Pants|Hat)/, ""),
  dosage: `${faker.number.int({ min: 1, max: 2 })} comp. de ${faker.number.int({ min: 5, max: 500 })}mg`,
  time: faker.date.future().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  patient: faker.person.firstName(),
});

const MOCK_MEDICATIONS: Medication[] = faker.helpers.multiple(
  createRandomMedication,
  {
    count: 3,
  }
);

export default function TodayMedications() {
  const renderItem = ({ item }: { item: Medication }) => (
    <Card className="p-4 flex-row items-center justify-between mb-3">
      <View className="flex-row items-center flex-1 mr-2">
        <View className="bg-primary/10 p-3 rounded-full mr-4">
          <Pill size={24} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground" numberOfLines={1}>{item.name}</Text>
          <Text className="text-sm text-muted-foreground">{item.dosage}</Text>
          <Text className="text-sm text-muted-foreground">
            Paciente: {item.patient}
          </Text>
        </View>
      </View>
      <View className="items-center">
        <Text className="text-lg font-bold text-foreground mb-2">{item.time}</Text>
        <Button title="Confirmar" size="sm" />
      </View>
    </Card>
  );

  return (
    <View>
      <Text className="text-lg font-bold text-foreground mb-4 px-6">
        Medicamentos de Hoje
      </Text>
      <FlatList
        data={MOCK_MEDICATIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <View className="w-4" />}
      />
    </View>
  );
}

import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { faker } from "@faker-js/faker";
import { Medication } from "../../types";
import MedicationListItem from "../../components/medications/MedicationListItem";
import { View } from "react-native";

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
    count: 10,
  }
);

export default function MedicationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Meus Remédios"
        buttonLabel="Adicionar"
        onButtonPress={() => alert("Adicionar novo remédio")}
      />
      <FlatList
        data={MOCK_MEDICATIONS}
        renderItem={({ item }) => <MedicationListItem medication={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}

import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { faker } from "@faker-js/faker";
import { Document } from "../../types";
import DocumentGridItem from "../../components/documents/DocumentGridItem";

// Gerar dados fictícios
const createRandomDocument = (): Document => ({
  id: faker.string.uuid(),
  title: faker.helpers.arrayElement(['Raio-X do Tórax', 'Exame de Sangue', 'Ressonância Magnética', 'Eletrocardiograma', 'Teste Ergométrico']),
  date: faker.date.past(),
  patient: faker.person.firstName(),
});

const MOCK_DOCUMENTS: Document[] = faker.helpers.multiple(
  createRandomDocument,
  {
    count: 11,
  }
);

export default function DocumentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Meus Exames"
        buttonLabel="Adicionar"
        onButtonPress={() => alert("Adicionar novo exame")}
      />
      <FlatList
        data={MOCK_DOCUMENTS}
        renderItem={({ item }) => <DocumentGridItem document={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}

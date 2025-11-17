import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { faker } from "@faker-js/faker";
import { Appointment } from "../../types";
import AppointmentListItem from "../../components/appointments/AppointmentListItem";
import { add, sub } from 'date-fns';

// Gerar dados fictícios
const createRandomAppointment = (dateFn: (date: Date) => Date): Appointment => ({
  id: faker.string.uuid(),
  specialty: faker.lorem.word(),
  doctor: `Dr(a). ${faker.person.firstName()} ${faker.person.lastName()}`,
  date: dateFn(new Date()),
  location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
  patient: faker.person.firstName(),
});

const upcomingAppointments = faker.helpers.multiple(() => createRandomAppointment((d) => add(d, { days: faker.number.int({ min: 1, max: 30 })})), { count: 3 });
const pastAppointments = faker.helpers.multiple(() => createRandomAppointment((d) => sub(d, { days: faker.number.int({ min: 1, max: 30 })})), { count: 5 });

const APPOINTMENT_SECTIONS = [
    { title: 'Próximas Consultas', data: upcomingAppointments.sort((a, b) => a.date.getTime() - b.date.getTime()) },
    { title: 'Consultas Anteriores', data: pastAppointments.sort((a, b) => b.date.getTime() - a.date.getTime()) },
];


export default function AppointmentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Minhas Consultas"
        buttonLabel="Agendar"
        onButtonPress={() => alert("Agendar nova consulta")}
      />
      <SectionList
        sections={APPOINTMENT_SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View className="px-6"><AppointmentListItem appointment={item} /></View>}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-lg font-bold text-foreground mb-3 px-6">{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={<View className="h-2"/>}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        SectionSeparatorComponent={() => <View className="h-6" />}
        renderSectionFooter={({section}) => section.data.length === 0 ? <Text className="text-muted-foreground text-center px-6 pb-4">Nenhuma consulta encontrada.</Text> : null}
      />
    </SafeAreaView>
  );
}

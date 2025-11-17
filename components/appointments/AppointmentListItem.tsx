import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Card from '../ui/Card';
import { Appointment } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AppointmentListItemProps = {
  appointment: Appointment;
};

export default function AppointmentListItem({ appointment }: AppointmentListItemProps) {
  const formattedTime = format(appointment.date, "HH:mm");

  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-base font-bold text-secondary-foreground bg-secondary/90 px-3 py-1 rounded-full self-start mb-2 capitalize">{appointment.specialty}</Text>
          <Text className="text-lg font-bold text-foreground">{appointment.doctor}</Text>
          <Text className="text-base text-muted-foreground">Paciente: {appointment.patient}</Text>
        </View>
        <View className="items-end">
           <Text className="text-lg font-bold text-foreground">{formattedTime}</Text>
           <Text className="text-sm text-muted-foreground">{format(appointment.date, "dd/MM/yy")}</Text>
        </View>
      </View>
      <View className="border-t border-border my-3" />
      <View className="flex-row items-center">
        <MapPin size={16} className="text-muted-foreground mr-2" />
        <Text className="text-sm text-muted-foreground flex-1">{appointment.location}</Text>
      </View>
    </Card>
  );
}

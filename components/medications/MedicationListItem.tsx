import { View, Text } from 'react-native';
import { Pill } from 'lucide-react-native';
import Card from '../ui/Card';
import { Medication } from '../../types';

type MedicationListItemProps = {
  medication: Medication;
};

export default function MedicationListItem({ medication }: MedicationListItemProps) {
  return (
    <Card className="p-4 flex-row items-center">
      <View className="bg-primary/10 p-3 rounded-full mr-4">
        <Pill size={24} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-foreground" numberOfLines={1}>
          {medication.name}
        </Text>
        <Text className="text-sm text-muted-foreground">{medication.dosage}</Text>
        <Text className="text-sm text-muted-foreground">
          Horário: {medication.time}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Paciente: {medication.patient}
        </Text>
      </View>
    </Card>
  );
}

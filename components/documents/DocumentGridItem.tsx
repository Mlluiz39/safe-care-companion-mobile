import { View, Text, Pressable } from 'react-native';
import { FileText, Download } from 'lucide-react-native';
import Card from '../ui/Card';
import { Document } from '../../types';
import { format } from 'date-fns';

type DocumentGridItemProps = {
  document: Document;
};

export default function DocumentGridItem({ document }: DocumentGridItemProps) {
  const formattedDate = format(document.date, "dd/MM/yyyy");

  return (
    <Card className="p-4 flex-1">
      <View className="flex-row justify-between items-start">
        <View className="bg-accent/10 p-3 rounded-full">
          <FileText size={24} className="text-accent" />
        </View>
        <Pressable onPress={() => alert('Baixar documento')} className="p-1">
            <Download size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
      <View className="mt-3">
        <Text className="text-base font-bold text-foreground" numberOfLines={2}>{document.title}</Text>
        <Text className="text-sm text-muted-foreground mt-1">Paciente: {document.patient}</Text>
        <Text className="text-sm text-muted-foreground mt-1">Data: {formattedDate}</Text>
      </View>
    </Card>
  );
}

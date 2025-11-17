import { View, Text, Image } from 'react-native';
import Card from '../ui/Card';
import { FamilyMember } from '../../types';

type FamilyMemberCardProps = {
  member: FamilyMember;
};

export default function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  return (
    <Card className="p-4 flex-row items-center">
      <Image
        source={{ uri: member.avatar_url }}
        className="w-16 h-16 rounded-full mr-4 bg-muted"
      />
      <View>
        <Text className="text-lg font-bold text-foreground">{member.name}</Text>
        <Text className="text-base text-muted-foreground capitalize">{member.relationship}</Text>
      </View>
    </Card>
  );
}

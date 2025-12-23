import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Card from '../ui/Card'
import { FamilyMember } from '../../types'
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../constants/colors'

type FamilyMemberCardProps = {
  member: FamilyMember
  onPress?: () => void
}

export default function FamilyMemberCard({ member, onPress }: FamilyMemberCardProps) {
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Image source={{ uri: member.avatar_url }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.relationship}>
            {capitalizeFirst(member.relationship)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
    backgroundColor: colors.muted.DEFAULT,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  relationship: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
  },
})

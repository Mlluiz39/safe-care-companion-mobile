import { View, Text, Image, StyleSheet } from 'react-native'
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
}

export default function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <Card style={styles.card}>
      <Image source={{ uri: member.avatar_url }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.relationship}>
          {capitalizeFirst(member.relationship)}
        </Text>
      </View>
    </Card>
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

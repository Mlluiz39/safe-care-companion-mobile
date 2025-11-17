import { View, Text } from "react-native";
import Button from "./Button";

type ScreenHeaderProps = {
  title: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
};

export default function ScreenHeader({
  title,
  buttonLabel,
  onButtonPress,
}: ScreenHeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-6 pt-4 pb-4 bg-background">
      <Text className="text-2xl font-bold text-foreground">{title}</Text>
      {buttonLabel && (
        <Button title={buttonLabel} onPress={onButtonPress} size="sm" />
      )}
    </View>
  );
}

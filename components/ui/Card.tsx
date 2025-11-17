import { View } from "react-native";

const Card = ({ className, ...props }: React.ComponentProps<typeof View>) => (
  <View
    className={`bg-card border border-border/50 rounded-2xl shadow-sm ${className}`}
    {...props}
  />
);

export default Card;

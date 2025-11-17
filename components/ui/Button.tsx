import { Pressable, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button = ({
  title,
  onPress,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseClasses = "justify-center items-center rounded-md active:opacity-80";
  const disabledClasses = "opacity-50";

  const sizeClasses = {
    default: "h-10 px-4",
    sm: "h-9 px-3",
    lg: "h-12 px-8",
  };

  const variantClasses = {
    default: "bg-primary",
    destructive: "bg-destructive",
    outline: "bg-transparent border border-input",
    secondary: "bg-secondary",
  };
  
  const textVariantClasses = {
    default: "text-primary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    secondary: "text-secondary-foreground",
  };
  
  const textSizeClasses = {
    default: "text-base font-semibold",
    sm: "text-sm font-medium",
    lg: "text-lg font-semibold",
  };

  return (
    <StyledPressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled || loading ? disabledClasses : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`${textSizeClasses[size]} ${textVariantClasses[variant]}`}>
          {title}
        </Text>
      )}
    </StyledPressable>
  );
};

export default Button;

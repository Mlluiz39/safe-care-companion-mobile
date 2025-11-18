/**
 * Cores do tema da aplicação
 * Baseado no tailwind.config.js original
 */

// Função auxiliar para converter HSL para string de cor
// React Native não suporta HSL diretamente, então vamos usar valores RGB aproximados
export const colors = {
  background: '#FFFFFF',
  foreground: '#2D3748', // hsl(215 25% 20%)
  card: '#FFFFFF',
  'card-foreground': '#2D3748',
  popover: '#FFFFFF',
  'popover-foreground': '#2D3748',
  primary: {
    DEFAULT: '#14B8D6', // hsl(185 70% 45%) - azul turquesa
    foreground: '#FFFFFF',
  },
  secondary: {
    DEFAULT: '#22C55E', // hsl(142 60% 50%) - verde
    foreground: '#FFFFFF',
  },
  muted: {
    DEFAULT: '#F1F5F9', // hsl(210 40% 96.1%)
    foreground: '#64748B', // hsl(215.4 16.3% 46.9%)
  },
  accent: {
    DEFAULT: '#F97316', // hsl(25 95% 53%) - laranja
    foreground: '#FFFFFF',
  },
  destructive: {
    DEFAULT: '#EF4444', // hsl(0 84.2% 60.2%) - vermelho
    foreground: '#FFFFFF',
  },
  border: '#E2E8F0', // hsl(214.3 31.8% 91.4%)
  input: '#E2E8F0',
  ring: '#14B8D6', // primary
}

// Cores com opacidade (usando rgba)
export const colorsWithOpacity = {
  'primary/5': 'rgba(20, 184, 214, 0.05)',
  'primary/10': 'rgba(20, 184, 214, 0.1)',
  'secondary/10': 'rgba(34, 197, 94, 0.1)',
  'secondary/90': 'rgba(34, 197, 94, 0.9)',
  'accent/10': 'rgba(249, 115, 22, 0.1)',
  'border/50': 'rgba(226, 232, 240, 0.5)',
  'blue-500/10': 'rgba(59, 130, 246, 0.1)',
}

// Espaçamentos padrão
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

// Border radius
export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
}

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
}

// Font weights
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

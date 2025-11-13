import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

/**
 * Retorna uma cor de acordo com o tema atual (claro ou escuro)
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}

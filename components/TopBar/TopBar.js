import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: insets.top-10, // status bar + breathing room
        backgroundColor: '#1D201F',
      }}
    />
  );
}

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SolidTabBarBackground() {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = colorScheme === 'dark' ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.92)';

  return <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />;
}

export function useBottomTabOverflow() {
  // approximate extra bottom inset used by tab bar height
  return 72;
}

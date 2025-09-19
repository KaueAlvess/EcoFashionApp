import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import barIcon from '../../assets/images/bar.png';
import camisetaIcon from '../../assets/images/camiseta.png';
import mobileIcon from '../../assets/images/mobile.png';
// ...existing code...
import { Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Roupas',
          tabBarIcon: ({ color, size }) => (
            <Image
        source={camisetaIcon}
        style={{ width: size ?? 28, height: size ?? 28, tintColor: color }}
        resizeMode="contain"
      />
    ),
  }}
/>,
    <Tabs.Screen
    
  name="perfil"
  options={{
    title: 'Perfil',
    tabBarIcon: ({ color, size }) => (
      <Image
        source={mobileIcon}
        style={{ width: size ?? 28, height: size ?? 28, tintColor: color }}
        resizeMode="contain"
      />
    ),
  }}
/>
<Tabs.Screen
    
  name="sobrenos"
  options={{
    title: 'Sobre Nós',
    tabBarIcon: ({ color, size }) => (
      <Image
        source={barIcon}
        style={{ width: size ?? 28, height: size ?? 28, tintColor: color }}
        resizeMode="contain"
      />
    ),
  }}
/>
      </Tabs>
  );
}

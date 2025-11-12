import { Tabs, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// ...existing code...

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const lastSegment = segments && segments.length > 0 ? segments[segments.length - 1] : null;
  const lastSegmentName = lastSegment ? String(lastSegment) : '';
  
  

  return (
    <>
      {/* Small global back button: appears on every tab layout; hidden on root screens if no history */}
      <View style={styles.backWrap} pointerEvents="box-none">
        <TouchableOpacity onPress={() => { try { router.back(); } catch (e) {} }} style={styles.backBtn} accessibilityLabel="Voltar">
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
      </View>

      {/* logo button moved into TabBarBackground to live inside the navbar */}

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 72,
            paddingTop: 8,
            paddingBottom: 12,
            alignItems: 'center',
            justifyContent: 'center',
          },
          default: {
            height: 70,
            paddingBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="lock.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Cadastro',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.badge.plus.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="roupas"
        options={{
          title: 'Roupas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      {/* Keep a hidden entry for legacy /explore route so it doesn't show in the tab bar
          if the file still exists on disk (tooling may take a restart to regenerate routes). */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="doacao"
        options={{
          title: 'Doações',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gift.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="administracao"
        options={{
          title: 'Administração',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="lock.fill" color={color} />,
        }}
      />
      
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  backWrap: { position: 'absolute', top: Platform.OS === 'web' ? 12 : 6, left: 12, zIndex: 999 },
  backBtn: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8 },
  backTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  
});

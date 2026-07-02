import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: styles.tabBarHidden,
        tabBarButton: () => null,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarHidden: {
    display: 'none',
    height: 0,
  },
});

import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform } from 'react-native'
import { useEffect } from 'react'

import {
  initNotifications,
  registerForLocalNotifications,
} from '@/lib/notifications'

export default function TabLayout() {
  useEffect(() => {
    async function setupNotifications() {
      await initNotifications()
      await registerForLocalNotifications()
    }

    setupNotifications()
  }, [])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'hsl(185 70% 45%)',
        tabBarInactiveTintColor: 'hsl(215.4 16.3% 46.9%)',
        tabBarStyle: {
          backgroundColor: 'hsl(0 0% 100%)',
          borderTopWidth: 1,
          borderTopColor: 'hsl(214.3 31.8% 91.4%)',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="medications"
        options={{
          title: 'Remédios',
          tabBarIcon: ({ color }) => (
            <Ionicons name="medkit" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="documents"
        options={{
          title: 'Exames',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="family"
        options={{
          title: 'Familiares',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

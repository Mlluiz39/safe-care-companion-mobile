import { Stack, useRouter, useSegments } from 'expo-router'
import { initNotifications } from '../lib/notifications'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../lib/auth'
import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '../constants/colors'

const InitialLayout = () => {
  const { session, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    initNotifications()
    if (isLoading) return

    const inAuthGroup = segments[0] === 'auth'

    if (session && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!session && !inAuthGroup) {
      router.replace('/auth')
    }
  }, [session, isLoading, segments, router])

  if (isLoading) {
    return <View style={styles.loadingContainer} />
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="medications/add" options={{ headerShown: false }} />
        <Stack.Screen name="appointments/add" options={{ headerShown: false }} />
        <Stack.Screen name="documents/add" options={{ headerShown: false }} />
        <Stack.Screen name="family/add" options={{ headerShown: false }} />
        <Stack.Screen name="patient/select" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
})

import { PatientProvider } from '../context/PatientContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <PatientProvider>
        <InitialLayout />
      </PatientProvider>
    </AuthProvider>
  )
}

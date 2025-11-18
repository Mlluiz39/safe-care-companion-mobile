import { Stack, useRouter, useSegments } from 'expo-router'
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
    if (isLoading) return

    const inTabsGroup = segments[0] === '(tabs)'

    if (session && !inTabsGroup) {
      router.replace('/(tabs)')
    } else if (!session) {
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

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  )
}

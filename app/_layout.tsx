import { Stack, useRouter, useSegments } from 'expo-router'
import { initNotifications } from '../lib/notifications'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../lib/auth'
import { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { colors } from '../constants/colors'
import AlarmScreen from '../components/medications/AlarmScreen'


const InitialLayout = () => {
  const { session, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const [alarmVisible, setAlarmVisible] = useState(false)
  const [alarmData, setAlarmData] = useState<{ name: string; dosage: string } | null>(null)
  const notificationListener = useRef<any>()

  useEffect(() => {
    initNotifications()
    
    // Handler for regular notification received (foreground)
    const handleNotification = (notification: any) => {
      const { title, body } = notification.request.content
      const identifier = notification.request.identifier
      
      // Check if it's a medication notification
      if (identifier?.startsWith('med-')) {
        const medicationName = body?.split(' — ')[0] || 'Medicamento'
        const dosage = body?.split(' — ')[1] || ''
        
        setAlarmData({ name: medicationName, dosage })
        setAlarmVisible(true)
      }
    }

    // Set up listeners
    const setupListener = async () => {
      const Notifications = await import('expo-notifications')
      
      // Foreground listener
      notificationListener.current = Notifications.addNotificationReceivedListener(handleNotification)

      // Background/Interaction listener
      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        handleNotification(response.notification)
      })

      // Check for initial notification (if app was closed)
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        handleNotification(lastNotificationResponse.notification)
      }

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current)
        }
        Notifications.removeNotificationSubscription(responseListener)
      }
    }
    
    const cleanupPromise = setupListener()
    
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup())
    }
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === 'auth'

    if (session && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!session && !inAuthGroup) {
      router.replace('/auth')
    }
  }, [session, isLoading, segments, router])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={{ marginTop: 20, color: colors.muted.foreground }}>Carregando...</Text>
      </View>
    )
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
      
      {alarmData && (
        <AlarmScreen
          visible={alarmVisible}
          medicationName={alarmData.name}
          dosage={alarmData.dosage}
          onDismiss={() => {
            setAlarmVisible(false)
            setAlarmData(null)
          }}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

import { PatientProvider } from '../context/PatientContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PatientProvider>
          <InitialLayout />
        </PatientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

import { Stack, useRouter, useSegments } from 'expo-router'
import { initNotifications } from '../lib/notifications'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../lib/auth'
import { useEffect, useState, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
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
    
    // Set up notification listener
    const setupListener = async () => {
      const Notifications = await import('expo-notifications')
      
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        const { title, body } = notification.request.content
        const identifier = notification.request.identifier
        
        // Check if it's a medication notification
        if (identifier?.startsWith('med-')) {
          // Parse medication info from notification
          const medicationName = body?.split(' — ')[0] || 'Medicamento'
          const dosage = body?.split(' — ')[1] || ''
          
          setAlarmData({ name: medicationName, dosage })
          setAlarmVisible(true)
        }
      })
    }
    
    setupListener()
    
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
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

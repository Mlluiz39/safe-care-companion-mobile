import { Modal, View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSize, spacing, borderRadius } from '../../constants/colors'

type AlarmScreenProps = {
  visible: boolean
  medicationName: string
  dosage: string
  onDismiss: () => void
}

export default function AlarmScreen({ visible, medicationName, dosage, onDismiss }: AlarmScreenProps) {
  const soundRef = useRef<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (visible) {
      playAlarmSound()
      // Vibrate continuously in a pattern
      const VIBRATION_PATTERN = [1000, 2000, 1000, 2000] // Vibrate 1s, Pause 2s (repeat handled by loop)
      Vibration.vibrate(VIBRATION_PATTERN, true) 
    } else {
      stopAlarmSound()
      Vibration.cancel()
    }

    return () => {
      stopAlarmSound()
      Vibration.cancel()
    }
  }, [visible])

  const playAlarmSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      })

      // Use a valid sound URL. This is a standard alarm beep.
      // If this URL fails, the vibration will still work.
      const { sound } = await Audio.Sound.createAsync(
         { uri: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
         { shouldPlay: true, isLooping: true, volume: 1.0 }
      )
      
      soundRef.current = sound
      setIsPlaying(true)
    } catch (error) {
      console.error('Error playing alarm sound:', error)
      setIsPlaying(false)
    }
  }

  const stopAlarmSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync()
        await soundRef.current.unloadAsync()
        soundRef.current = null
      }
      setIsPlaying(false)
    } catch (error) {
      console.error('Error stopping alarm sound:', error)
    }
  }

  const handleDismiss = async () => {
    await stopAlarmSound()
    Vibration.cancel()
    onDismiss()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleDismiss} // Require explicit action on Android
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.pulseRing} />
            <Ionicons name="notifications-circle" size={140} color={colors.primary.DEFAULT} />
          </View>

          <Text style={styles.title}>HORA DO REMÉDIO!</Text>
          
          <View style={styles.card}>
            <Text style={styles.label}>Medicamento:</Text>
            <Text style={styles.medicationName}>{medicationName}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.label}>Dose:</Text>
            <Text style={styles.dosage}>{dosage}</Text>
          </View>

          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={32} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.dismissButtonText}>JÁ TOMEI O REMÉDIO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-evenly', // Distribute space evenly
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary.DEFAULT,
    opacity: 0.15,
  },
  title: {
    fontSize: 28, // Hardcoded for larger size
    fontWeight: '900', // Extra bold
    color: colors.foreground,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary.DEFAULT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: fontSize.lg,
    color: colors.muted.foreground,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  medicationName: {
    fontSize: 32, // Very large for readability
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: spacing.md,
  },
  dosage: {
    fontSize: 24,
    color: colors.foreground,
    textAlign: 'center',
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: '#16a34a', // Green color to indicate positive action
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: borderRadius.xl,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dismissButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

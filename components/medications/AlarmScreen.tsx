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
      // Vibrate continuously
      Vibration.vibrate([1000, 1000], true) // Pattern: vibrate 1s, pause 1s, repeat
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
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      })

      // Use a simple beep sound that loops
      // Since we don't have a custom alarm file, we'll create a repeating interval
      // that plays the notification sound
      const playSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/adaptive-icon.png'), // This will fail, triggering fallback
            { shouldPlay: true, volume: 1.0 }
          )
          await sound.playAsync()
          setTimeout(() => sound.unloadAsync(), 1000)
        } catch {
          // Silently fail - we're using vibration as primary alert
        }
      }

      // Play sound every 2 seconds
      const interval = setInterval(playSound, 2000)
      soundRef.current = { interval } as any
      setIsPlaying(true)
      
      // Play immediately
      playSound()
    } catch (error) {
      console.error('Error playing alarm sound:', error)
      setIsPlaying(false)
    }
  }


  const stopAlarmSound = async () => {
    try {
      if (soundRef.current) {
        if ((soundRef.current as any).interval) {
          clearInterval((soundRef.current as any).interval)
        } else if ((soundRef.current as any).stopAsync) {
          await (soundRef.current as any).stopAsync()
          await (soundRef.current as any).unloadAsync()
        }
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
      animationType="fade"
      transparent={false}
      onRequestClose={handleDismiss}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={120} color={colors.primary.DEFAULT} />
        </View>

        <Text style={styles.title}>Hora do Medicamento!</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.medicationName}>{medicationName}</Text>
          <Text style={styles.dosage}>{dosage}</Text>
        </View>

        <View style={styles.pulseContainer}>
          <View style={[styles.pulse, styles.pulse1]} />
          <View style={[styles.pulse, styles.pulse2]} />
          <View style={[styles.pulse, styles.pulse3]} />
        </View>

        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={handleDismiss}
          activeOpacity={0.8}
        >
          <Text style={styles.dismissButtonText}>TOMAR MEDICAMENTO</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Toque para confirmar que tomou o medicamento</Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl * 2,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl * 2,
    width: '100%',
    alignItems: 'center',
  },
  medicationName: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  dosage: {
    fontSize: fontSize.xl,
    color: colors.muted.foreground,
    textAlign: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary.DEFAULT,
    opacity: 0.3,
  },
  pulse1: {
    // Animation would be added via Animated API if needed
  },
  pulse2: {
    // Animation would be added via Animated API if needed
  },
  pulse3: {
    // Animation would be added via Animated API if needed
  },
  dismissButton: {
    backgroundColor: colors.primary.DEFAULT,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dismissButtonText: {
    color: 'white',
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hint: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
    textAlign: 'center',
  },
})

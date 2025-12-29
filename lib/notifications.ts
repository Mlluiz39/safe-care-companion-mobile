import type * as ExpoNotifications from 'expo-notifications'
import { Platform } from 'react-native'

let handlerInitialized = false

/* ===========================
   INIT
=========================== */
export async function initNotifications() {
    if (handlerInitialized) return

    try {
        const Notifications = await import('expo-notifications')

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
                // iOS only
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        })

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Medicamentos',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                bypassDnd: true,
            })
        }

        handlerInitialized = true
    } catch (error) {
        console.warn('Failed to load expo-notifications:', error)
    }
}

/* ===========================
   PERMISSIONS
   =========================== */
export const registerForPushNotificationsAsync = registerForLocalNotifications // Alias for compatibility

export async function registerForLocalNotifications() {
    const Notifications = await import('expo-notifications')

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }
    
    if (finalStatus !== 'granted') {
        alert('Permissão para notificações é necessária para o alarme funcionar!')
    }
}

/* ===========================
   HELPERS
=========================== */
function createDailyTrigger(time: string): ExpoNotifications.DailyTriggerInput {
    const [hour, minute] = time.split(':').map(Number)

    return {
        type: 'daily',
        hour,
        minute,
    } as unknown as ExpoNotifications.DailyTriggerInput
}

/* ===========================
   SCHEDULE
=========================== */
export async function scheduleMedicationNotification(
    medicationId: string,
    name: string,
    dosage: string,
    time: string
) {
    try {
        const Notifications = await import('expo-notifications')

        await Notifications.scheduleNotificationAsync({
            identifier: `med-${medicationId}-${time}`,
            content: {
                title: 'Hora do medicamento 💊',
                body: `${name} — ${dosage}`,
                sound: 'default',
            },
            trigger: createDailyTrigger(time),
        })

        return true
    } catch (error) {
        console.error('Erro ao agendar notificação:', error)
        return false
    }
}



/* ===========================
   CANCEL
=========================== */
export async function cancelMedicationNotifications(medicationId: string) {
    const Notifications = await import('expo-notifications')
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()

    for (const n of scheduled) {
        if (n.identifier?.startsWith(`med-${medicationId}`)) {
            await Notifications.cancelScheduledNotificationAsync(n.identifier)
        }
    }
}

/* ===========================
   FULL RESET (opcional)
=========================== */
export async function cancelAllMedicationNotifications() {
    const Notifications = await import('expo-notifications')
    await Notifications.cancelAllScheduledNotificationsAsync()
}

export async function scheduleOneTimeNotification(
    id: string,
    title: string,
    body: string,
    date: Date
) {
    try {
        const Notifications = await import('expo-notifications')

        await Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title,
                body,
                sound: 'default',
            },
            trigger: {
                type: 'date',
                date,
            } as unknown as ExpoNotifications.DateTriggerInput,
        })

        return true
    } catch (error) {
        console.error('Erro ao agendar notificação única:', error)
        return false
    }
}

export async function cancelNotification(identifier: string) {
    try {
        const Notifications = await import('expo-notifications')
        await Notifications.cancelScheduledNotificationAsync(identifier)
    } catch (error) {
        console.error('Erro ao cancelar notificação:', error)
    }
}

import type * as ExpoNotifications from 'expo-notifications'
import { Platform } from 'react-native'
import Constants, { ExecutionEnvironment } from 'expo-constants'

const isExpoGoAndroid = () =>
    Platform.OS === 'android' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient

let handlerInitialized = false

/* ===========================
   INIT
=========================== */
export async function initNotifications() {
    if (handlerInitialized || isExpoGoAndroid()) return

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
    if (isExpoGoAndroid()) return

    const Notifications = await import('expo-notifications')

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Medicamentos',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
        })
    }

    const { status } = await Notifications.getPermissionsAsync()
    if (status !== 'granted') {
        const request = await Notifications.requestPermissionsAsync()
        if (request.status !== 'granted') {
            alert('Permissão para notificações é necessária!')
        }
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
    if (isExpoGoAndroid()) return false

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
    if (isExpoGoAndroid()) return

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
    if (isExpoGoAndroid()) return

    const Notifications = await import('expo-notifications')
    await Notifications.cancelAllScheduledNotificationsAsync()
}

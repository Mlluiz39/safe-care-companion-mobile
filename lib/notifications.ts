import type * as ExpoNotifications from 'expo-notifications'
import { Platform } from 'react-native'

let handlerInitialized = false

/**
 * Inicializa handler e canal de notificações
 */
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
                vibrationPattern: [0, 500, 200, 500],
                lightColor: '#FF231F7C',
                lockscreenVisibility:
                    Notifications.AndroidNotificationVisibility.PUBLIC,
                bypassDnd: true,
                sound: 'alarm.wav',
            })
        }

        handlerInitialized = true
    } catch (error) {
        console.warn('Falha ao inicializar notificações:', error)
    }
}

/**
 * Permissões (local notifications)
 */
export const registerForPushNotificationsAsync =
    registerForLocalNotifications

export async function registerForLocalNotifications() {
    const Notifications = await import('expo-notifications')

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync()

    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
        const { status } =
            await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== 'granted') {
        alert(
            'Permissão para notificações é necessária para os alarmes de medicamentos!'
        )
    }
}

/**
 * Agenda notificação diária e retorna o ID REAL do Expo
 */
export async function scheduleMedicationNotification(
    name: string,
    dosage: string,
    time: string
): Promise<string | null> {
    try {
        const Notifications = await import('expo-notifications')
        const [hour, minute] = time.split(':').map(Number)

        const notificationId =
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Hora do medicamento 💊',
                    body: `${name} — ${dosage}`,
                    sound: 'alarm.wav',
                    priority:
                        Notifications.AndroidNotificationPriority.MAX,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                    hour,
                    minute,
                    repeats: true,
                },
            })

        return notificationId
    } catch (error) {
        console.error('Erro ao agendar notificação:', error)
        return null
    }
}

/**
 * Cancela notificações por ID REAL
 */
export async function cancelMedicationNotifications(
    notificationIds: string[]
) {
    try {
        const Notifications = await import('expo-notifications')

        for (const id of notificationIds) {
            await Notifications.cancelScheduledNotificationAsync(id)
        }
    } catch (error) {
        console.error(
            'Erro ao cancelar notificações do medicamento:',
            error
        )
    }
}

/**
 * Cancela TODAS as notificações do app (uso administrativo)
 */
export async function cancelAllMedicationNotifications() {
    try {
        const Notifications = await import('expo-notifications')
        await Notifications.cancelAllScheduledNotificationsAsync()
    } catch (error) {
        console.error(
            'Erro ao cancelar todas notificações:',
            error
        )
    }
}

/**
 * Agenda notificação única (ex: lembrete pontual)
 */
export async function scheduleOneTimeNotification(
    title: string,
    body: string,
    date: Date
): Promise<string | null> {
    try {
        const Notifications = await import('expo-notifications')

        const id =
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: 'default',
                },
                trigger: {
                    date,
                } as unknown as ExpoNotifications.DateTriggerInput,
            })

        return id
    } catch (error) {
        console.error(
            'Erro ao agendar notificação única:',
            error
        )
        return null
    }
}

/**
 * Cancela UMA notificação específica
 */
export async function cancelNotification(identifier: string) {
    try {
        const Notifications = await import('expo-notifications')
        await Notifications.cancelScheduledNotificationAsync(
            identifier
        )
    } catch (error) {
        console.error('Erro ao cancelar notificação:', error)
    }
}

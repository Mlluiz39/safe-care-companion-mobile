import { useState, useEffect } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Switch } from 'react-native'
import { useAuth } from '../../lib/auth'
import { addAppointment } from '../../lib/appointments'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import DateTimePicker from '../../components/ui/DateTimePicker'


import { usePatient } from '../../context/PatientContext'
import { registerForPushNotificationsAsync, scheduleOneTimeNotification } from '../../lib/notifications'

export default function AddAppointmentScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { currentPatient } = usePatient()

    const [specialty, setSpecialty] = useState('')
    const [doctor, setDoctor] = useState('')
    const [dateTime, setDateTime] = useState(() => {
        const now = new Date()
        now.setHours(9, 0, 0, 0)
        return now
    })
    const [location, setLocation] = useState('')
    const [notes, setNotes] = useState('')
    const [remindMe, setRemindMe] = useState(false)

    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    const handleSave = async () => {
        if (!specialty.trim() || !doctor.trim()) {
            Alert.alert('Erro', 'Especialidade e Médico são obrigatórios.')
            return
        }

        if (!currentPatient) {
            Alert.alert('Erro', 'Selecione um paciente antes de agendar.')
            return
        }

        try {
            const newAppointment = await addAppointment({
                specialty,
                doctor,
                date: dateTime.toISOString(),
                location,
                notes,
                status: 'scheduled',
                user_id: user!.id,
                patient_id: currentPatient.id,
            })

            if (remindMe && newAppointment?.id) {
                 await scheduleOneTimeNotification(
                    `appointment-${newAppointment.id}`,
                    'Lembrete de Consulta 🩺',
                    `${specialty} com ${doctor}`,
                    dateTime
                )
            }

            Alert.alert('Sucesso', 'Consulta agendada!', [
                {
                    text: 'Adicionar ao Google Agenda',
                    onPress: () => addToGoogleCalendar(dateTime),
                },
                { text: 'OK', onPress: () => router.back() }
            ])
        } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Falha ao agendar consulta.')
        }
    }

    const addToGoogleCalendar = (dateObj: Date) => {
        const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '')
        const end = new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consulta: ${specialty} - ${doctor}&dates=${start}/${end}&details=${notes}&location=${location}`

        Linking.openURL(url)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="Agendar Consulta" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Especialidade (ex: Cardiologista)"
                        value={specialty}
                        onChangeText={setSpecialty}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Médico (ex: Dr. Silva)"
                        value={doctor}
                        onChangeText={setDoctor}
                    />

                    <DateTimePicker
                        value={dateTime}
                        onChange={setDateTime}
                        mode="datetime"
                        label="Data e Hora da Consulta"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Local"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <TextInput
                        style={[styles.input, styles.largeInput]}
                        placeholder="Observações (opcional)"
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Lembrar-me</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: colors.primary.DEFAULT }}
                            thumbColor={remindMe ? "#f4f3f4" : "#f4f3f4"}
                            onValueChange={setRemindMe}
                            value={remindMe}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        padding: spacing.lg,
    },
    input: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 10,
        marginBottom: spacing.md,
        fontSize: fontSize.base,
        color: colors.foreground,
    },
    largeInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    button: {
        backgroundColor: colors.primary.DEFAULT,
        padding: spacing.md,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    buttonText: {
        color: '#fff',
        fontSize: fontSize.lg,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 10,
    },
    switchLabel: {
        fontSize: fontSize.base,
        color: colors.foreground,
        fontWeight: '500',
    },
})

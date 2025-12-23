import { useState, useEffect } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { updateAppointment, deleteAppointment } from '../../lib/appointments'
import { cancelNotification, scheduleOneTimeNotification, registerForPushNotificationsAsync } from '../../lib/notifications'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { supabase } from '../../lib/supabase'

export default function EditAppointmentScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    
    const [loading, setLoading] = useState(true)
    const [specialty, setSpecialty] = useState('')
    const [doctor, setDoctor] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [location, setLocation] = useState('')
    const [notes, setNotes] = useState('')
    const [remindMe, setRemindMe] = useState(false) // Default off for edit, user must enable to reschedule

    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    useEffect(() => {
        fetchAppointment()
    }, [id])

    async function fetchAppointment() {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setSpecialty(data.specialty)
            setDoctor(data.doctor)
            
            const dateObj = new Date(data.date)
            setDate(dateObj.toISOString().split('T')[0])
            setTime(dateObj.toISOString().split('T')[1].substring(0, 5)) // HH:MM
            
            setLocation(data.location || '')
            setNotes(data.notes || '')
        } catch (error) {
            console.error('Error fetching appointment:', error)
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!specialty.trim() || !doctor.trim() || !date.trim()) {
            Alert.alert('Erro', 'Especialidade, Médico e Data são obrigatórios.')
            return
        }

        try {
            const dateTime = new Date(`${date}T${time || '00:00'}:00`)

            await updateAppointment(id as string, {
                specialty,
                doctor,
                date: dateTime.toISOString(),
                location,
                notes,
            })

            if (remindMe) {
                 await scheduleOneTimeNotification(
                    `appointment-${id}`,
                    'Lembrete de Consulta 🩺',
                    `${specialty} com ${doctor}`,
                    dateTime
                )
            }

            Alert.alert('Sucesso', 'Consulta atualizada!')
            router.back()
        } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Falha ao atualizar consulta.')
        }
    }

    const handleDelete = async () => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir esta consulta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelNotification(`appointment-${id}`)
                            await deleteAppointment(id as string)
                            router.back()
                        } catch (e: any) {
                            Alert.alert('Erro', e.message ?? 'Falha ao excluir.')
                        }
                    },
                },
            ]
        )
    }

    if (loading) return null // Or spinner

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="Editar Consulta" />

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

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Data (YYYY-MM-DD)"
                            value={date}
                            onChangeText={setDate}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Hora (HH:MM)"
                            value={time}
                            onChangeText={setTime}
                        />
                    </View>

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
                        <Text style={styles.switchLabel}>Atualizar Lembrete</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: colors.primary.DEFAULT }}
                            thumbColor={remindMe ? "#f4f3f4" : "#f4f3f4"}
                            onValueChange={setRemindMe}
                            value={remindMe}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.deleteButton]} 
                        onPress={handleDelete}
                    >
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>Excluir Consulta</Text>
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
    deleteButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.destructive.DEFAULT,
        marginTop: spacing.lg,
    },
    deleteButtonText: {
        color: colors.destructive.DEFAULT,
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

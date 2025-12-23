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
    Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { updateDocument, deleteDocument } from '../../lib/documents'
import { cancelNotification, scheduleOneTimeNotification, registerForPushNotificationsAsync } from '../../lib/notifications'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { supabase } from '../../lib/supabase'

export default function EditDocumentScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [notes, setNotes] = useState('')
    const [remindMe, setRemindMe] = useState(false)

    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    useEffect(() => {
        fetchDocument()
    }, [id])

    async function fetchDocument() {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setTitle(data.title)
            setType(data.type)
            const dateObj = new Date(data.date)
            setDate(dateObj.toISOString().split('T')[0])
            setTime(dateObj.toISOString().split('T')[1].substring(0, 5)) // HH:MM
            setNotes(data.notes || '')
        } catch (error) {
            console.error('Error fetching document:', error)
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const addToGoogleCalendar = (dateStr: string) => {
        const dateObj = new Date(dateStr)
        const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '')
        const end = new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '') // +1 hour

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Exame: ${title}&dates=${start}/${end}&details=${notes}`
        Linking.openURL(url)
    }

    const handleUpdate = async () => {
        if (!title.trim() || !type.trim()) {
            Alert.alert('Erro', 'Título e Tipo são obrigatórios.')
            return
        }

        try {
            const dateTime = new Date(`${date}T${time}:00`)

            await updateDocument(id as string, {
                title,
                type,
                date: dateTime.toISOString(),
                notes,
            })

            if (remindMe) {
                 await scheduleOneTimeNotification(
                    `document-${id}`,
                    'Lembrete de Exame 📄',
                    `${title} (${type})`,
                    dateTime
                )
            }

            Alert.alert('Sucesso', 'Documento atualizado!', [
                {
                    text: 'Agendar no Google Agenda',
                    onPress: () => addToGoogleCalendar(date),
                },
                { text: 'OK', onPress: () => router.back() }
            ])
        } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Falha ao atualizar documento.')
        }
    }

    const handleDelete = async () => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este documento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelNotification(`document-${id}`)
                            await deleteDocument(id as string)
                            router.back()
                        } catch (e: any) {
                            Alert.alert('Erro', e.message ?? 'Falha ao excluir.')
                        }
                    },
                },
            ]
        )
    }

    if (loading) return null

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="Editar Documento" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Título (ex: Hemograma)"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Tipo (ex: Exame de Sangue, Raio-X)"
                        value={type}
                        onChangeText={setType}
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
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>Excluir Documento</Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
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

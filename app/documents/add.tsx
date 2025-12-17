import { useState } from 'react'
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
import { useAuth } from '../../lib/auth'
import { addDocument } from '../../lib/documents'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'

import { usePatient } from '../../context/PatientContext'

export default function AddDocumentScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { currentPatient } = usePatient()

    const [title, setTitle] = useState('')
    const [type, setType] = useState('Exame de Sangue') // Default
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')

    const addToGoogleCalendar = (dateStr: string) => {
        const dateObj = new Date(dateStr)
        const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '')
        const end = new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '') // +1 hour

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Exame: ${title}&dates=${start}/${end}&details=${notes}`
        Linking.openURL(url)
    }

    const handleSave = async () => {
        if (!title.trim() || !type.trim()) {
            Alert.alert('Erro', 'Título e Tipo são obrigatórios.')
            return
        }

        if (!currentPatient) {
            Alert.alert('Erro', 'Selecione um paciente antes de adicionar.')
            return
        }

        try {
            await addDocument({
                title,
                type,
                date: new Date(date).toISOString(),
                notes,
                user_id: user!.id,
                patient_id: currentPatient.id,
            })

            Alert.alert('Sucesso', 'Documento adicionado!', [
                {
                    text: 'Agendar no Google Agenda',
                    onPress: () => addToGoogleCalendar(date),
                },
                { text: 'OK', onPress: () => router.back() }
            ])
        } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Falha ao adicionar documento.')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="Adicionar Documento" />

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

                    <TextInput
                        style={styles.input}
                        placeholder="Data (YYYY-MM-DD)"
                        value={date}
                        onChangeText={setDate}
                    />

                    <TextInput
                        style={[styles.input, styles.largeInput]}
                        placeholder="Observações (opcional)"
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />

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
})

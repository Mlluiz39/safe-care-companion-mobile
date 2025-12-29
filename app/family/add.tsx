import { useState } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Share, // Added Share
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase' // Added supabase
import { addFamilyMember } from '../../lib/family'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'

import { usePatient } from '../../context/PatientContext'

export default function AddFamilyScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { currentPatient } = usePatient()

    const [name, setName] = useState('')
    const [relationship, setRelationship] = useState('')

    const handleSave = async () => {
        if (!name.trim() || !relationship.trim()) {
            Alert.alert('Erro', 'Nome e Parentesco são obrigatórios.')
            return
        }

        if (!currentPatient) {
            Alert.alert('Erro', 'Selecione um paciente antes de adicionar.')
            return
        }

        try {
            // 1. Check or generate invite code
            let inviteCode = currentPatient.invite_code

            if (!inviteCode) {
                // Generate simple 6-char code
                inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
                
                // Save code to patient
                const { error: updateError } = await supabase
                    .from('patients')
                    .update({ invite_code: inviteCode })
                    .eq('id', currentPatient.id)

                if (updateError) throw updateError
            }

            // 2. Add family member
            await addFamilyMember({
                name,
                relationship,
                user_id: user!.id,
                patient_id: currentPatient.id,
                // avatar_url optional
            })

            // 3. Share the code
            Alert.alert(
                'Sucesso',
                'Familiar adicionado! Compartilhe o código de acesso para que ele possa entrar na equipe.',
                [
                    {
                        text: 'Compartilhar Código',
                        onPress: async () => {
                             await Share.share({
                                message: `Olá! Estou convidando você para ajudar a cuidar de ${currentPatient.name} no app Health Care. \n\nUse o código de convite: *${inviteCode}* \n\nBaixe o app e entre em "Entrar com Código".`
                            })
                            router.back()
                        }
                    },
                    {
                        text: 'Fechar',
                        style: 'cancel',
                        onPress: () => router.back()
                    }
                ]
            )
            
        } catch (e: any) {
            console.error(e)
            Alert.alert('Erro', e.message ?? 'Falha ao adicionar familiar.')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader title="Adicionar Familiar" />

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Parentesco (ex: Filho, Mãe)"
                    value={relationship}
                    onChangeText={setRelationship}
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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

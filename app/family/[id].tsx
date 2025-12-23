import { useState, useEffect } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { updateFamilyMember, deleteFamilyMember } from '../../lib/family'
import { colors, spacing, fontSize } from '../../constants/colors'
import ScreenHeader from '../../components/ui/ScreenHeader'
import { supabase } from '../../lib/supabase'

export default function EditFamilyScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [relationship, setRelationship] = useState('')

    useEffect(() => {
        fetchFamilyMember()
    }, [id])

    async function fetchFamilyMember() {
        try {
            const { data, error } = await supabase
                .from('family_members')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setName(data.name)
            setRelationship(data.relationship)
        } catch (error) {
            console.error('Error fetching family member:', error)
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!name.trim() || !relationship.trim()) {
            Alert.alert('Erro', 'Nome e Parentesco são obrigatórios.')
            return
        }

        try {
            await updateFamilyMember(id as string, {
                name,
                relationship,
            })

            Alert.alert('Sucesso', 'Familiar atualizado!')
            router.back()
        } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Falha ao atualizar familiar.')
        }
    }

    const handleDelete = async () => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja remover este familiar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteFamilyMember(id as string)
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
            <ScreenHeader title="Editar Familiar" />

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

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]} 
                    onPress={handleDelete}
                >
                    <Text style={[styles.buttonText, styles.deleteButtonText]}>Excluir Familiar</Text>
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
    deleteButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.destructive.DEFAULT,
        marginTop: spacing.lg,
    },
    deleteButtonText: {
        color: colors.destructive.DEFAULT,
    },
})

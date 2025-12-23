import { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    TextInput,
    Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { usePatient } from '../../context/PatientContext'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { colors, spacing, fontSize, borderRadius, colorsWithOpacity } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

export default function SelectPatientScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { patients, currentPatient, setCurrentPatient, refreshPatients } = usePatient()

    const [showJoinModal, setShowJoinModal] = useState(false)
    const [inviteCode, setInviteCode] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newPatientName, setNewPatientName] = useState('')
    const [birthDate, setBirthDate] = useState('') // DD/MM/YYYY
    const [allergies, setAllergies] = useState('')

    const handleSelect = (patient: any) => {
        setCurrentPatient(patient)
        router.replace('/(tabs)')
    }

    const handleJoin = async () => {
        if (!inviteCode.trim()) return Alert.alert('Erro', 'Digite o código.')

        try {
            // 1. Find patient by code securely
            const { data: foundPatients, error: findError } = await supabase
                .rpc('lookup_patient_by_code', { code: inviteCode.trim() })

            if (findError) throw findError

            const patient = foundPatients && foundPatients.length > 0 ? foundPatients[0] : null

            if (!patient) {
                Alert.alert('Erro', 'Paciente não encontrado com este código.')
                return
            }

            // 2. Add to caregivers
            const { error: joinError } = await supabase
                .from('caregivers')
                .insert({
                    patient_id: patient.id,
                    user_id: user!.id,
                    role: 'member'
                })

            if (joinError) throw joinError

            Alert.alert('Sucesso', 'Você agora faz parte da equipe de cuidadores!')
            setShowJoinModal(false)
            setInviteCode('')
            refreshPatients()
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Falha ao entrar na equipe.')
        }
    }

    const handleCreate = async () => {
        if (!newPatientName.trim()) return Alert.alert("Erro", "Nome é obrigatório");

        // Simple date validation/conversion if needed. ensuring YYYY-MM-DD for Supabase date type
        let formattedDate = null;
        if (birthDate) {
            const parts = birthDate.split('/');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        try {
            const { error } = await supabase.from('patients').insert({
                name: newPatientName,
                user_id: user!.id,
                birth_date: formattedDate,
                allergies: allergies
            });
            if (error) throw error;

            Alert.alert("Sucesso", "Novo paciente criado!");
            setShowCreateModal(false);
            setNewPatientName("");
            setBirthDate("");
            setAllergies("");
            refreshPatients();
        } catch (e: any) {
            Alert.alert("Erro", e.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quem você está cuidando?</Text>
                <Text style={styles.subtitle}>Selecione um paciente para gerenciar</Text>
            </View>

            <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            currentPatient?.id === item.id && styles.activeCard,
                        ]}
                        onPress={() => handleSelect(item)}
                    >
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color={colors.primary.DEFAULT} />
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            {/* <Text style={styles.cardCode}>Código: {item.invite_code}</Text> */}
                        </View>
                        {currentPatient?.id === item.id && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} style={{ marginLeft: 'auto' }} />
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Você ainda não tem pacientes.</Text>
                }
            />

            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={() => setShowCreateModal(true)}>
                    <Ionicons name="add" size={24} color="white" />
                    <Text style={styles.buttonText}>Novo Paciente</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setShowJoinModal(true)}>
                    <Ionicons name="enter-outline" size={24} color={colors.primary.DEFAULT} />
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Entrar com Código</Text>
                </TouchableOpacity>
            </View>

            {/* JOIN COMPONENT */}
            <Modal visible={showJoinModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Entrar na Equipe</Text>
                        <Text style={styles.modalSub}>Peça o código de convite para o administrador do paciente.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Código (ex: a1b2c3d)"
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleJoin}>
                            <Text style={styles.modalButtonText}>Entrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowJoinModal(false)}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* CREATE COMPONENT */}
            <Modal visible={showCreateModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Novo Paciente</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Paciente"
                            value={newPatientName}
                            onChangeText={setNewPatientName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Data de Nascimento (DD/MM/AAAA)"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Alergias (separadas por vírgula)"
                            value={allergies}
                            onChangeText={setAllergies}
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={handleCreate}>
                            <Text style={styles.modalButtonText}>Criar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowCreateModal(false)}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: fontSize['2xl'],
        fontWeight: 'bold',
        color: colors.foreground,
    },
    subtitle: {
        fontSize: fontSize.base,
        color: colors.muted.foreground,
        marginTop: spacing.sm,
    },
    list: {
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCard: {
        borderColor: colors.primary.DEFAULT,
        backgroundColor: colorsWithOpacity['primary/5'],
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colorsWithOpacity['primary/10'],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md
    },
    cardTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.foreground
    },
    emptyText: {
        textAlign: 'center',
        color: colors.muted.foreground,
        marginTop: spacing.xl
    },
    actions: {
        gap: spacing.md
    },
    button: {
        backgroundColor: colors.primary.DEFAULT,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm
    },
    buttonText: {
        color: 'white',
        fontSize: fontSize.base,
        fontWeight: 'bold'
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary.DEFAULT
    },
    secondaryButtonText: {
        color: colors.primary.DEFAULT
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: spacing.lg
    },
    modalContent: {
        backgroundColor: colors.background,
        padding: spacing.lg,
        borderRadius: borderRadius.xl
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.md,
        textAlign: 'center'
    },
    modalSub: {
        color: colors.muted.foreground,
        marginBottom: spacing.md,
        textAlign: 'center'
    },
    input: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md
    },
    modalButton: {
        backgroundColor: colors.primary.DEFAULT,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.sm
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    closeButton: {
        padding: spacing.md,
        alignItems: 'center'
    },
    closeButtonText: {
        color: colors.muted.foreground
    }
})

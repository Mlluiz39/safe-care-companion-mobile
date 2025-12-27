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
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { usePatient } from '../../context/PatientContext'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { colors, spacing, fontSize, borderRadius, colorsWithOpacity } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '../../components/ui/DateTimePicker'

export default function SelectPatientScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { patients, currentPatient, setCurrentPatient, refreshPatients } = usePatient()

    const [showJoinModal, setShowJoinModal] = useState(false)
    const [inviteCode, setInviteCode] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newPatientName, setNewPatientName] = useState('')
    const [birthDate, setBirthDate] = useState(() => {
        const date = new Date()
        date.setFullYear(date.getFullYear() - 70) // Default: 70 anos atrás
        return date
    })
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
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

        // Validar email se fornecido
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Alert.alert("Erro", "Email inválido");
        }

        // Formatar data para YYYY-MM-DD
        const formattedDate = birthDate.toISOString().split('T')[0];

        try {
            const { error } = await supabase.from('patients').insert({
                name: newPatientName,
                user_id: user!.id,
                birth_date: formattedDate,
                gender: gender || null,
                phone: phone || null,
                email: email || null,
                allergies: allergies || null
            });
            if (error) throw error;

            Alert.alert("Sucesso", "Novo paciente criado!");
            setShowCreateModal(false);
            setNewPatientName("");
            setBirthDate(new Date(new Date().getFullYear() - 70, 0, 1));
            setGender("");
            setPhone("");
            setEmail("");
            setAllergies("");
            refreshPatients();
        } catch (e: any) {
            Alert.alert("Erro", e.message);
        }
    }

    const handleDelete = async (patient: any) => {
        const isOwner = patient.user_id === user?.id
        
        console.log('[DELETE] Attempting to delete patient:', patient.id)
        console.log('[DELETE] User ID:', user?.id)
        console.log('[DELETE] Patient Owner ID:', patient.user_id)
        console.log('[DELETE] Is Owner?', isOwner)

        const title = isOwner ? 'Excluir Paciente' : 'Sair da Equipe'
        const message = isOwner 
            ? `Tem certeza que deseja excluir ${patient.name}? Todos os dados serão perdidos permanentemente.`
            : `Tem certeza que deseja deixar de cuidar de ${patient.name}?`

        Alert.alert(title, message, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Confirmar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        if (isOwner) {
                            console.log('[DELETE] Executing owner delete on patients table...')
                            const { error, count } = await supabase
                                .from('patients')
                                .delete({ count: 'exact' })
                                .eq('id', patient.id)
                            
                            console.log('[DELETE] Result:', { error, count })

                            if (error) {
                                console.error('[DELETE] Supabase error:', error)
                                throw error
                            }

                            if (count === 0) {
                                throw new Error('Falha ao excluir. Verifique suas permissões ou se o item já foi removido.')
                            }
                            
                            if (currentPatient?.id === patient.id) {
                                setCurrentPatient(null)
                            }
                        } else {
                            console.log('[DELETE] Executing caregiver delete (leave)...')
                            const { error, count } = await supabase
                                .from('caregivers')
                                .delete({ count: 'exact' })
                                .eq('patient_id', patient.id)
                                .eq('user_id', user?.id)

                            console.log('[DELETE] Result:', { error, count })

                            if (error) {
                                console.error('[DELETE] Supabase error:', error)
                                throw error
                            }

                            if (count === 0) {
                                throw new Error('Falha ao sair da equipe. Verifique suas permissões.')
                            }
                         
                            if (currentPatient?.id === patient.id) {
                                setCurrentPatient(null)
                            }
                        }
                        console.log('[DELETE] Refreshing patients...')
                        await refreshPatients()
                    } catch (e: any) {
                        console.error('[DELETE] Exception:', e)
                        Alert.alert('Erro ao excluir', e.message || JSON.stringify(e))
                    }
                }
            }
        ])
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
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.destructive.DEFAULT} />
                        </TouchableOpacity>

                        {currentPatient?.id === item.id && (
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} />
                            </View>
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

                        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do Paciente"
                                value={newPatientName}
                                onChangeText={setNewPatientName}
                            />

                            <DateTimePicker
                                value={birthDate}
                                onChange={setBirthDate}
                                mode="date"
                                label="Data de Nascimento"
                                enableVoice={false}
                                showQuickActions={false}
                            />

                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerLabel}>Gênero</Text>
                                <Picker
                                    selectedValue={gender}
                                    onValueChange={setGender}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione..." value="" />
                                    <Picker.Item label="Masculino" value="male" />
                                    <Picker.Item label="Feminino" value="female" />
                                    <Picker.Item label="Outro" value="other" />
                                    <Picker.Item label="Prefiro não informar" value="not_specified" />
                                </Picker>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Telefone (opcional)"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Email (opcional)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Alergias (separadas por vírgula)"
                                value={allergies}
                                onChangeText={setAllergies}
                            />
                        </ScrollView>

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
    deleteButton: {
        padding: spacing.sm,
        marginRight: spacing.sm,
    },
    checkIcon: {
        marginLeft: 'auto'
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
        borderRadius: borderRadius.xl,
        maxHeight: '80%',
    },
    formScroll: {
        maxHeight: 400,
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
        marginBottom: spacing.md,
        color: colors.foreground,
    },
    pickerContainer: {
        marginBottom: spacing.md,
    },
    pickerLabel: {
        fontSize: fontSize.base,
        color: colors.foreground,
        marginBottom: spacing.sm,
        fontWeight: '500',
    },
    picker: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        color: colors.foreground,
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

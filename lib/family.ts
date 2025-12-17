import { supabase } from './supabase'
import { FamilyMember } from '../types'

export async function addFamilyMember(member: {
    name: string
    relationship: string
    user_id: string
    patient_id: string | null
    avatar_url?: string
}) {
    const { data, error } = await supabase
        .from('family_members')
        .insert([member])
        .select()

    if (error) {
        throw new Error('Erro ao adicionar familiar: ' + error.message)
    }

    return data
}

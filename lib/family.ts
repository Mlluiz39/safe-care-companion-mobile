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

export async function updateFamilyMember(id: string, updates: any) {
    const { data, error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new Error('Erro ao atualizar familiar: ' + error.message)
    }
    return data
}

export async function deleteFamilyMember(id: string) {
    const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Erro ao excluir familiar: ' + error.message)
    }
}

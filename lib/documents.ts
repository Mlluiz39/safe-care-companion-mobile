import { supabase } from './supabase'
import { Document } from '../types'

export async function addDocument(doc: {
    title: string
    type: string
    date: string
    notes?: string
    user_id: string
    patient_id?: string | null
    file_url?: string
}) {
    const { data, error } = await supabase
        .from('documents')
        .insert(doc)
        .select()
        .single()

    if (error) {
        console.error('Erro ao adicionar documento:', error)
        throw error
    }

    return data
}

export async function updateDocument(id: string, updates: any) {
    const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Erro ao atualizar documento:', error)
        throw error
    }
    return data
}

export async function deleteDocument(id: string) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Erro ao excluir documento:', error)
        throw error
    }
}

import { supabase } from './supabase'
import { Appointment } from '../types'

export async function addAppointment(appointment: {
  specialty: string
  doctor: string
  date: string
  location?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  user_id: string
  patient_id?: string | null
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single()

  if (error) {
    console.error('Erro ao adicionar consulta:', error)
    throw error
  }

  return data
}

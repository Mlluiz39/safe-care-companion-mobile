import { supabase } from './supabase'
import {
  scheduleMedicationNotification,
  cancelMedicationNotifications,
} from '@/lib/notifications'

type AddMedicationInput = {
  name: string
  dosage: string
  frequency: string
  patient_id?: string | null
  user_id: string
  start_date: string
  notes?: string
  time: string // HH:mm
}

export async function addMedication(med: AddMedicationInput) {
  // 1️⃣ Agendar notificação
  const notificationId = await scheduleMedicationNotification(
    med.name,
    med.dosage,
    med.time
  )

  // 2️⃣ Salvar medicamento + notification_ids
  const { data, error } = await supabase
    .from('medications')
    .insert({
      ...med,
      notification_ids: notificationId ? [notificationId] : [],
    })
    .select()
    .single()

  if (error) {
    console.error('❌ ERRO AO INSERIR:', error)

    // rollback da notificação se falhar o banco
    if (notificationId) {
      await cancelMedicationNotifications([notificationId])
    }

    throw error
  }

  console.log('✅ Medicamento inserido:', data)
  return data
}

export async function updateMedication(
  id: string,
  updates: Partial<AddMedicationInput> & {
    notification_ids?: string[]
  }
) {
  // 1️⃣ Buscar notificações antigas
  const { data: old } = await supabase
    .from('medications')
    .select('notification_ids')
    .eq('id', id)
    .single()

  // 2️⃣ Se horário mudou, cancelar e reagendar
  if (updates.time && old?.notification_ids?.length) {
    await cancelMedicationNotifications(old.notification_ids)

    const newNotificationId = await scheduleMedicationNotification(
      updates.name ?? '',
      updates.dosage ?? '',
      updates.time
    )

    updates.notification_ids = newNotificationId
      ? [newNotificationId]
      : []
  }

  // 3️⃣ Atualizar no banco
  const { data, error } = await supabase
    .from('medications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar medicamento:', error)
    throw error
  }

  return data
}

export async function deleteMedication(id: string) {
  // 1️⃣ Buscar IDs de notificação
  const { data } = await supabase
    .from('medications')
    .select('notification_ids')
    .eq('id', id)
    .single()

  // 2️⃣ Cancelar notificações
  if (data?.notification_ids?.length) {
    await cancelMedicationNotifications(data.notification_ids)
  }

  // 3️⃣ Excluir do banco
  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir medicamento:', error)
    throw error
  }
}

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
  time: string // usado apenas para notificação (NÃO vai pro banco)
}

// Tipo para operações de banco de dados (inclui notification_ids)
type MedicationDbRecord = Omit<AddMedicationInput, 'time'> & {
  notification_ids?: string[] | null
}

/* ───────────────────────── ADD ───────────────────────── */

export async function addMedication(med: AddMedicationInput) {
  const {
    time,
    ...dbMed // remove time antes de salvar
  } = med

  // 1️⃣ Agendar notificação
  const notificationId = await scheduleMedicationNotification(
    med.name,
    med.dosage,
    time
  )

  // 2️⃣ Salvar no banco
  const { data, error } = await supabase
    .from('medications')
    .insert({
      ...dbMed,
      notification_ids: notificationId ? [notificationId] : null,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ ERRO AO INSERIR:', error)

    // rollback da notificação
    if (notificationId) {
      await cancelMedicationNotifications([notificationId])
    }

    throw error
  }

  console.log('✅ Medicamento inserido:', data)
  return data
}

/* ───────────────────────── UPDATE ───────────────────────── */

export async function updateMedication(
  id: string,
  updates: Partial<AddMedicationInput>
) {
  const { time, ...rest } = updates
  const dbUpdates = rest as Partial<MedicationDbRecord>

  // 1️⃣ Buscar dados antigos
  const { data: old, error: fetchError } = await supabase
    .from('medications')
    .select('name, dosage, notification_ids')
    .eq('id', id)
    .single()

  if (fetchError || !old) {
    throw fetchError
  }

  // 2️⃣ Se horário mudou → reagendar
  if (time) {
    if (old.notification_ids?.length) {
      await cancelMedicationNotifications(old.notification_ids)
    }

    const newNotificationId = await scheduleMedicationNotification(
      updates.name ?? old.name,
      updates.dosage ?? old.dosage,
      time
    )

    dbUpdates.notification_ids = newNotificationId
      ? [newNotificationId]
      : null
  }

  // 3️⃣ Atualizar banco
  const { data, error } = await supabase
    .from('medications')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar medicamento:', error)
    throw error
  }

  return data
}

/* ───────────────────────── DELETE ───────────────────────── */

export async function deleteMedication(id: string) {
  // 1️⃣ Buscar notificações
  const { data } = await supabase
    .from('medications')
    .select('notification_ids')
    .eq('id', id)
    .single()

  // 2️⃣ Cancelar notificações
  if (data?.notification_ids?.length) {
    await cancelMedicationNotifications(data.notification_ids)
  }

  // 3️⃣ Excluir
  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir medicamento:', error)
    throw error
  }
}

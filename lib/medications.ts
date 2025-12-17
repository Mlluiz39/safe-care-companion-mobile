import { supabase } from './supabase'

export async function addMedication(med: {
  name: string
  dosage: string
  frequency: string
  patient_id?: string | null
  user_id: string
  start_date: string
  notes?: string
}) {
  const { data, error } = await supabase
    .from('medications')
    .insert(med)
    .select()
    .single()

  if (error) {
    console.log("❌ ERRO AO INSERIR:", error);
    throw error;
  }

  console.log("✅ Medicamento inserido:", data);
  return data;
}

export interface Patient {
  id: string
  user_id: string
  name: string
  birth_date?: string
  gender?: string
  phone?: string
  email?: string
  address?: string
  invite_code?: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  user_id: string
  patient_id?: string
  name: string
  dosage: string
  frequency: string
  start_date?: string
  end_date?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: Patient
}

export interface Appointment {
  id: string
  user_id: string
  patient_id?: string
  specialty: string
  doctor: string
  date: string
  location?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  patient?: Patient
}

export interface Document {
  id: string
  user_id: string
  patient_id?: string
  title: string
  type: string
  date: string
  file_url?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: Patient
}

export interface FamilyMember {
  id: string
  user_id: string
  patient_id?: string
  name: string
  relationship: string
  avatar_url?: string
  created_at: string
}

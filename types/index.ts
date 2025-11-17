export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  patient: string;
}

export interface Appointment {
  id: string;
  specialty: string;
  doctor: string;
  date: Date;
  location: string;
  patient: string;
}

export interface Document {
  id: string;
  title: string;
  date: Date;
  patient: string;
}

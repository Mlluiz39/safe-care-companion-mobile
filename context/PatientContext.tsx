import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Patient } from '../types'

type PatientContextType = {
    currentPatient: Patient | null
    setCurrentPatient: (patient: Patient | null) => void
    patients: Patient[]
    refreshPatients: () => Promise<void>
    isLoading: boolean
}

const PatientContext = createContext<PatientContextType>({
    currentPatient: null,
    setCurrentPatient: () => { },
    patients: [],
    refreshPatients: async () => { },
    isLoading: true,
})

export const usePatient = () => useContext(PatientContext)

export const PatientProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
    const [patients, setPatients] = useState<Patient[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const refreshPatients = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            // Fetch patients owned by user OR shared with user
            // Since our RLS policy handles the filtering ("Users can view patients they care for"),
            // we can just select * from patients.
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            setPatients(data || [])

            // Auto-select first patient if none selected
            if (data && data.length > 0 && !currentPatient) {
                setCurrentPatient(data[0])
            }
        } catch (error) {
            console.error('Error fetching patients:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            refreshPatients()
        } else {
            setPatients([])
            setCurrentPatient(null)
        }
    }, [user])

    return (
        <PatientContext.Provider
            value={{
                currentPatient,
                setCurrentPatient,
                patients,
                refreshPatients,
                isLoading,
            }}
        >
            {children}
        </PatientContext.Provider>
    )
}

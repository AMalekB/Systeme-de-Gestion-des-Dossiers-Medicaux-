import LayoutDashboard from '@/components/LayoutDashboard'
import PatientTable from '@/components/PatientTable'

export default function AdminPatientsPage() {
  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Liste des patients</h2>
        
      </div>
      <PatientTable/>
    </LayoutDashboard>
  )
}
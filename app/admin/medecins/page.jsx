import LayoutDashboard from '@/components/LayoutDashboard'
import MedecinsList from '@/components/MedecinsList'

export default function AdminDoctorsPage() {
  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Liste des médecins</h2>
         </div>
      <MedecinsList/>
    </LayoutDashboard>
  )
}
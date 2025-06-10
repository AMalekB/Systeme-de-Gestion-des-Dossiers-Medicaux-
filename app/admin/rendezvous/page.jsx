import LayoutDashboard from '@/components/LayoutDashboard'
import RendezvousList from '@/components/RendezvousList'

export default function AdminRendezvousPage() {
  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Liste des rendez-vous</h2>
      </div>
      <RendezvousList />
    </LayoutDashboard>
  )
}

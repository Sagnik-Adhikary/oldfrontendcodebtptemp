import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button' 
import { Loader2, Check, X, User, Mail, Calendar,} from 'lucide-react'
import { getApiUrl } from '../config'
import toast from 'react-hot-toast'

export const AdminDashboard = () => {
  const { token } = useAuth()
  const [pendingFounders, setPendingFounders] = useState<any[]>([])
  const [supportMessages, setSupportMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('approvals')

  const fetchData = async () => {
    try {
      const [foundersRes, messagesRes] = await Promise.all([
        fetch(getApiUrl('/api/admin/pending-founders'), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(getApiUrl('/api/admin/support-messages'), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (foundersRes.ok) setPendingFounders(await foundersRes.json())
      if (messagesRes.ok) setSupportMessages(await messagesRes.json())
    } catch (error) {
      console.error("Failed to fetch admin data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleApproval = async (id: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/founders/${id}/${action}`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success(`Founder ${action}d successfully`)
        setPendingFounders(prev => prev.filter(f => f.id !== id))
      }
    } catch (error) {
      toast.error("Action failed")
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex space-x-4 mb-6">
          <Button 
            variant={activeTab === 'approvals' ? 'default' : 'outline'}
            onClick={() => setActiveTab('approvals')}
          >
            Pending Approvals ({pendingFounders.length})
          </Button>
          <Button 
            variant={activeTab === 'support' ? 'default' : 'outline'}
            onClick={() => setActiveTab('support')}
          >
            Support Messages ({supportMessages.length})
          </Button>
        </div>

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {pendingFounders.length === 0 ? (
              <p className="text-gray-500">No pending approvals.</p>
            ) : (
              pendingFounders.map(founder => (
                <Card key={founder.id}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{founder.name}</h3>
                      <div className="text-sm text-gray-500 flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4"/> {founder.email}</span>
                        <span className="flex items-center gap-2"><User className="w-4 h-4"/> Class of {founder.graduation_year} • {founder.department}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Registered: {new Date(founder.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproval(founder.id, 'approve')} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button onClick={() => handleApproval(founder.id, 'reject')} variant="destructive">
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-4">
            {supportMessages.length === 0 ? (
              <p className="text-gray-500">No support messages.</p>
            ) : (
              supportMessages.map(msg => (
                <Card key={msg.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{msg.user_name}</CardTitle>
                    <CardDescription>{msg.user_email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="bg-gray-100 p-3 rounded-md mb-2">{msg.last_message}</p>
                    <div className="flex justify-end">
                       <Button size="sm" onClick={() => window.location.href=`/messages/${msg.id}`}>
                         Reply
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Loader2, CheckCircle, XCircle, Users, Calendar, GraduationCap, Building2 } from 'lucide-react'
import { getApiUrl } from '../config'
import { useNavigate } from 'react-router-dom'

interface PendingFounder {
  id: number
  name: string
  email: string
  graduation_year: number | null
  department: string | null
  created_at: string
}

export const AdminAllowingPage: React.FC = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [founders, setFounders] = useState<PendingFounder[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    loadPendingFounders()
  }, [user, navigate])

  const loadPendingFounders = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await fetch(getApiUrl('/api/admin/pending-founders'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFounders(data)
      } else {
        console.error('Failed to load pending founders')
      }
    } catch (error) {
      console.error('Error loading pending founders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (founderId: number) => {
    if (!token) return
    
    try {
      setProcessing(founderId)
      const response = await fetch(getApiUrl(`/api/admin/founders/${founderId}/approve`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFounders(founders.filter(f => f.id !== founderId))
      } else {
        alert('Failed to approve founder')
      }
    } catch (error) {
      console.error('Error approving founder:', error)
      alert('Error approving founder')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (founderId: number) => {
    if (!token) return
    
    if (!confirm('Are you sure you want to reject this founder?')) {
      return
    }
    
    try {
      setProcessing(founderId)
      const response = await fetch(getApiUrl(`/api/admin/founders/${founderId}/reject`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFounders(founders.filter(f => f.id !== founderId))
      } else {
        alert('Failed to reject founder')
      }
    } catch (error) {
      console.error('Error rejecting founder:', error)
      alert('Error rejecting founder')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24">
      <div className="container mx-auto px-4 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Founder Approvals</h1>
          </div>
          <p className="text-gray-600">
            Review and approve or reject founder registrations
          </p>
        </div>

        {founders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No pending founder approvals</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {founders.map((founder) => (
              <Card key={founder.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{founder.name}</CardTitle>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <span>{founder.email}</span>
                        </div>
                        {founder.graduation_year && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">Graduation Year:</span>
                            <span>{founder.graduation_year}</span>
                          </div>
                        )}
                        {founder.department && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">Department:</span>
                            <span>{founder.department}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Registered:</span>
                          <span>{formatDate(founder.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(founder.id)}
                      disabled={processing === founder.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {processing === founder.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(founder.id)}
                      disabled={processing === founder.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processing === founder.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

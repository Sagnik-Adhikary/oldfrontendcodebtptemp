import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getApiUrl } from '../config'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Loader2, MessageCircle, ArrowLeft, Calendar, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { formatDate } from '../lib/dataUtils'

interface ServiceRequest {
  id: number
  user_id: number
  service_id?: number
  project_type: string
  description: string
  budget_range?: string
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

export const AdminServiceRequestsPage: React.FC = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (token) {
      fetchRequests()
    }
  }, [token])

  const fetchRequests = async () => {
    try {
      const res = await fetch(getApiUrl('/api/launchpad/admin/requests'), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      } else {
        console.error('Failed to fetch requests')
        toast.error('Failed to load service requests')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async (request: ServiceRequest) => {
    try {
      setProcessingId(request.id)
      
      // 1. Start/Get conversation
      const res = await fetch(getApiUrl('/api/messages/conversations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ other_user_id: request.user.id })
      })

      if (res.ok) {
        const conversation = await res.json()
        
        // 2. Optionally update status to 'contacted' if it's currently 'pending'
        if (request.status === 'pending') {
          // functionality to update status could be separate, but let's leave it for now
          // or we could auto-update. Let's just navigate for now.
        }

        navigate(`/messages/${conversation.id}`)
      } else {
        toast.error('Failed to start chat')
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      toast.error('Failed to connect to chat')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
        </div>

        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage 
                        src={request.user.avatar ? getApiUrl(`/api/profile/picture/${request.user.avatar}`) : undefined} 
                        alt={request.user.name} 
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {request.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{request.project_type}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>by {request.user.name}</span>
                        <span>•</span>
                        <span>{request.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      request.status === 'pending' ? 'secondary' : 
                      request.status === 'contacted' ? 'outline' :
                      request.status === 'completed' ? 'default' : 'secondary'
                    } className={`capitalize ${
                      request.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : ''
                    }`}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(request.created_at)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FileText className="h-4 w-4 mr-1" /> Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap pl-5 border-l-2 border-gray-100">
                      {request.description}
                    </p>
                  </div>
                  
                  {request.budget_range && (
                    <div className="flex gap-2 text-sm">
                      <span className="font-medium text-gray-500">Budget:</span>
                      <span className="text-gray-900">{request.budget_range}</span>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-4">
                    <Button 
                      onClick={() => handleChat(request)} 
                      disabled={!!processingId}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="h-4 w-4 mr-2" />
                      )}
                      Chat with User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Requests Found</h3>
              <p className="text-gray-500 mt-2">There are currently no service requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

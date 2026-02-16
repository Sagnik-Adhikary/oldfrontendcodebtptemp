import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Loader2, MessageCircle, Mail, User } from 'lucide-react'
import { getApiUrl } from '../config'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../lib/dataUtils'

interface SupportConversation {
  id: number
  user_id: number
  user_name: string
  user_email: string
  last_message: string | null
  last_message_time: string
  unread_count: number
  created_at: string
}

export const AdminSupportPage: React.FC = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<SupportConversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    loadSupportMessages()
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadSupportMessages, 5000)
    return () => clearInterval(interval)
  }, [user, navigate])

  const loadSupportMessages = async () => {
    if (!token) return
    
    try {
      const response = await fetch(getApiUrl('/api/admin/support-messages'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      } else {
        console.error('Failed to load support messages')
      }
    } catch (error) {
      console.error('Error loading support messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConversationClick = (conversationId: number) => {
    navigate(`/messages/${conversationId}`)
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
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Support Messages</h1>
          </div>
          <p className="text-gray-600">
            View and respond to support messages from users
          </p>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No support messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={undefined} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 mb-1">
                            {conversation.user_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{conversation.user_email}</span>
                          </div>
                        </div>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-blue-600">
                            {conversation.unread_count} new
                          </Badge>
                        )}
                      </div>
                      
                      {conversation.last_message && (
                        <div className="mt-3">
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {conversation.last_message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(conversation.last_message_time)}
                          </p>
                        </div>
                      )}
                    </div>
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

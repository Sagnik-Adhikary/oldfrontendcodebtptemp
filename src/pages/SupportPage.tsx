import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Loader2, Send, MessageCircle, CheckCircle } from 'lucide-react'
import { getApiUrl } from '../config'
import { useNavigate } from 'react-router-dom'

export const SupportPage: React.FC = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    if (!token) {
      setError('You must be logged in to send a support message')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(getApiUrl('/api/support/message'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      })

      if (response.ok) {
        setSuccess(true)
        setMessage('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending support message:', error)
      setError('An error occurred while sending your message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Contact Support</h1>
            </div>
            <p className="text-gray-600">
              Have a question or need help? Send us a message and we'll get back to you.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your message has been sent successfully! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    Please provide as much detail as possible so we can help you better.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !message.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              You can also view your support conversation in the{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/messages')}
              >
                Messages
              </Button>{' '}
              section.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

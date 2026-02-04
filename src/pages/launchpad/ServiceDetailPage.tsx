import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Service } from '../../types'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Clock, DollarSign, MessageCircle, ArrowLeft, Heart, Share2 } from 'lucide-react'

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/launchpad/services/${id}`), {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setService(data)
        }
      } catch (error) {
        console.error('Error fetching service details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchService()
  }, [id, token])

  if (loading) return <div className="flex justify-center py-20">Loading...</div>
  if (!service) return <div className="flex justify-center py-20">Service not found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Link to="/launchpad" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Launchpad
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-200">
               {service.image_url ? (
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
               )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About this service</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {service.description}
              </div>
            </div>
            
             <div className="bg-white rounded-xl p-6 shadow-sm">
               <h2 className="text-xl font-semibold mb-4">Reviews & Past Work</h2>
               <p className="text-gray-500 italic">No reviews yet.</p>
               {/* Placeholder for future reviews/portfolio */}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
               <div className="flex items-center justify-between mb-6">
                 <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700">
                   {service.category}
                 </Badge>
                 <div className="flex space-x-2">
                   <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                     <Heart className="h-5 w-5" />
                   </Button>
                   <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-500">
                     <Share2 className="h-5 w-5" />
                   </Button>
                 </div>
               </div>
               
               <div className="space-y-4 mb-6">
                 <div className="flex items-center justify-between text-gray-700">
                   <div className="flex items-center">
                     <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                     <span className="font-medium">Price Range</span>
                   </div>
                   <span className="font-bold">{service.price_range || 'Contact us'}</span>
                 </div>
                 <div className="flex items-center justify-between text-gray-700">
                   <div className="flex items-center">
                     <Clock className="h-5 w-5 mr-2 text-gray-400" />
                     <span className="font-medium">Delivery Time</span>
                   </div>
                   <span className="font-bold">{service.delivery_time || 'Flexible'}</span>
                 </div>
               </div>
               
               <div className="border-t pt-6 mb-6">
                 <div className="flex items-center mb-4">
                   <Avatar className="h-12 w-12 mr-3">
                     <AvatarImage src={service.provider?.avatar ? getApiUrl(`/api/profile/picture/${service.provider.avatar}`) : undefined} />
                     <AvatarFallback>{service.provider?.name?.charAt(0) || '?'}</AvatarFallback>
                   </Avatar>
                   <div>
                     <h3 className="font-semibold text-gray-900">{service.provider?.name}</h3>
                     <p className="text-sm text-gray-500 line-clamp-1">{service.provider?.bio || 'Service Provider'}</p>
                   </div>
                 </div>
                 <Button className="w-full mb-3" size="lg">
                    Contact Provider
                 </Button>
                 <Button variant="outline" className="w-full" asChild>
                   <Link to={`/messages/${service.provider?.id}`}>
                     <MessageCircle className="h-4 w-4 mr-2" />
                     Message
                   </Link>
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

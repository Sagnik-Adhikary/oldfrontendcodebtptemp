import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
    Loader2, Calendar, MapPin, Clock, ChevronRight, User, ArrowLeft
} from 'lucide-react'

interface EnrolledEvent {
    id: number
    title: string
    description: string
    type: string
    date: string
    time: string
    location: string
    image_url?: string
    speaker_name?: string
    enrolled_at: string
}

export const MyEventsPage: React.FC = () => {
    const { user, token, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [events, setEvents] = useState<EnrolledEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login')
            return
        }
        if (token) {
            fetchEnrolledEvents()
        }
    }, [token, authLoading, user])

    const fetchEnrolledEvents = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(getApiUrl('/api/users/enrolled-events'), {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Error fetching enrolled events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    }

    const isPastEvent = (dateStr: string) => {
        return new Date(dateStr) < new Date()
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link to="/student-dashboard">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">My Events</h1>
                            <p className="text-slate-600">Events you've registered for</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                    </div>
                ) : events.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {events.map((event, idx) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to={`/events/${event.id}`} className="block group">
                                    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${isPastEvent(event.date) ? 'opacity-70' : ''}`}>
                                        {/* Event Image */}
                                        <div className="relative h-40 overflow-hidden">
                                            {event.image_url ? (
                                                <img 
                                                    src={event.image_url} 
                                                    alt={event.title} 
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                                    <Calendar className="h-12 w-12 text-white/50" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                {isPastEvent(event.date) ? (
                                                    <Badge className="bg-slate-100 text-slate-600">Past Event</Badge>
                                                ) : (
                                                    <Badge className="bg-green-100 text-green-700">Registered</Badge>
                                                )}
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <Badge variant="outline" className="bg-white/90">{event.type}</Badge>
                                            </div>
                                        </div>
                                        
                                        {/* Event Content */}
                                        <div className="p-5">
                                            <h3 className="font-semibold text-lg text-slate-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                {event.title}
                                            </h3>
                                            
                                            {/* Date and Time */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="h-4 w-4 text-orange-500" />
                                                    <span>{formatDate(event.date)}</span>
                                                </div>
                                                {event.time && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Clock className="h-4 w-4 text-orange-500" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                )}
                                                {event.location && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <MapPin className="h-4 w-4 text-orange-500" />
                                                        <span className="line-clamp-1">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Speaker */}
                                            {event.speaker_name && (
                                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-orange-600" />
                                                    </div>
                                                    <span className="text-sm text-slate-600">{event.speaker_name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <Calendar className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No registered events yet</h3>
                        <p className="text-slate-500 mb-6">Explore upcoming events and register to attend!</p>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                            <Link to="/events">
                                Browse Events <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

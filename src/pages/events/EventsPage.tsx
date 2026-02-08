import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, Mic, Video, Coffee, Presentation } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { toast } from 'react-hot-toast'
import type { Event } from '../../types'
import { Loader2 } from 'lucide-react'

// Helper to get icon based on event type
const getEventIcon = (type: string) => {
    switch (type) {
        case 'Podcast': return <Mic className="h-4 w-4" />
        case 'Seminar': return <Presentation className="h-4 w-4" />
        case 'Webinar': return <Video className="h-4 w-4" />
        case 'Fundae Session': return <Coffee className="h-4 w-4" />
        case 'Meeting': return <Users className="h-4 w-4" />
        default: return <Calendar className="h-4 w-4" />
    }
}

export const EventsPage: React.FC = () => {
    const { token } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [enrollingId, setEnrollingId] = useState<number | null>(null)
    const [selectedType, setSelectedType] = useState<string>('All')

    const fetchEvents = async () => {
        try {
            const res = await fetch(getApiUrl('/api/events'), {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            toast.error('Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [token])

    const handleEnroll = async (eventId: number) => {
        if (!token) {
            toast.error('Please login to enroll')
            return
        }
        
        setEnrollingId(eventId)
        try {
            const res = await fetch(getApiUrl(`/api/events/${eventId}/enroll`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (res.ok) {
                toast.success('Successfully enrolled!')
                // Refresh list to update enrollment status
                fetchEvents()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to enroll')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredEvents = selectedType === 'All' 
        ? events 
        : events.filter(e => e.type === selectedType)

    const eventTypes = ['All', 'Podcast', 'Seminar', 'Webinar', 'Fundae Session', 'Meeting']

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-900/50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Discover and join seminars, podcasts, and community sessions.
                        </p>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {eventTypes.map(type => (
                            <Button
                                key={type}
                                variant={selectedType === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedType(type)}
                                className="rounded-full"
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No events found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                                    <div className="relative h-48 w-full">
                                        <img 
                                            src={event.image_url || 'https://via.placeholder.com/400x200'} 
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white/90 dark:bg-black/90 dark:text-white backdrop-blur-sm">
                                            {getEventIcon(event.type)}
                                            <span className="ml-1">{event.type}</span>
                                        </Badge>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric'
                                            })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4">
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                            {event.description}
                                        </p>
                                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{event.attendee_count} attending</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {event.is_enrolled ? (
                                            <Button disabled className="w-full bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 border">
                                                Already Registered
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="w-full" 
                                                onClick={() => handleEnroll(event.id)}
                                                disabled={enrollingId === event.id}
                                            >
                                                {enrollingId === event.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Register Now
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

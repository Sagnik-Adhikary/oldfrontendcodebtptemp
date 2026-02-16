import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users, Calendar, MapPin, Loader2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'react-hot-toast'
import { Card } from '../../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import type { Event } from '../../types'
import { Badge } from '../../components/ui/badge'

export const AdminEventsPage: React.FC = () => {
    const { token } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingEventId, setEditingEventId] = useState<number | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Webinar',
        date: '',
        time: '',
        location: '',
        image_url: '',
        speaker_name: '',
        speaker_bio: '',
        speaker_image: '',
        speaker_contact: ''
    })

    const fetchEvents = async () => {
        try {
            const res = await fetch(getApiUrl('/api/events'), {
                headers: { 'Authorization': `Bearer ${token}` }
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

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'Webinar',
            date: '',
            time: '',
            location: '',
            image_url: '',
            speaker_name: '',
            speaker_bio: '',
            speaker_image: '',
            speaker_contact: ''
        })
        setIsEditMode(false)
        setEditingEventId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setIsCreateModalOpen(true)
    }

    const openEditModal = (event: Event) => {
        setFormData({
            title: event.title,
            description: event.description,
            type: event.type,
            date: event.date,
            time: event.time,
            location: event.location,
            image_url: event.image_url || '',
            speaker_name: event.speaker_name || '',
            speaker_bio: event.speaker_bio || '',
            speaker_image: event.speaker_image || '',
            speaker_contact: event.speaker_contact || ''
        })
        setIsEditMode(true)
        setEditingEventId(event.id)
        setIsCreateModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        const url = isEditMode && editingEventId 
            ? getApiUrl(`/api/events/${editingEventId}`) 
            : getApiUrl('/api/events')
        
        const method = isEditMode ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(isEditMode ? 'Event updated successfully' : 'Event created successfully')
                setIsCreateModalOpen(false)
                fetchEvents()
                resetForm()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to save event')
            }
        } catch (error) {
            console.error('Error saving event:', error)
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return
        }

        try {
            const res = await fetch(getApiUrl(`/api/events/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.ok) {
                toast.success('Event deleted successfully')
                fetchEvents()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to delete event')
            }
        } catch (error) {
            console.error('Error deleting event:', error)
            toast.error('Something went wrong')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Events</h1>
                    <p className="text-gray-500">Create and manage seminars, webinars, and more.</p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-48 h-48 md:h-auto relative bg-gray-100">
                                {event.image_url ? (
                                    <img 
                                        src={event.image_url} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Calendar className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant="outline" className="mb-2">{event.type}</Badge>
                                            <h3 className="text-xl font-bold">{event.title}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(event)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(event.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{event.attendee_count || 0} Attending</span>
                                        </div>
                                        <div className="flex items-center gap-2 col-span-2">
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-end">
                                    <Button variant="outline" asChild>
                                        <Link to={`/admin/events/${event.id}`}>View Attendees</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {events.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
                        <p className="text-gray-500">Create your first event to get started.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Event Type *</Label>
                                <Select 
                                    value={formData.type} 
                                    onValueChange={(val) => handleSelectChange('type', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Podcast">Podcast</SelectItem>
                                        <SelectItem value="Seminar">Seminar</SelectItem>
                                        <SelectItem value="Webinar">Webinar</SelectItem>
                                        <SelectItem value="Fundae Session">Fundae Session</SelectItem>
                                        <SelectItem value="Meeting">Meeting / Discussion Circle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location / Link *</Label>
                                <Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Auditorium or Zoom Link" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time *</Label>
                                <Input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Cover Image URL (Optional)</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold mb-4">Speaker Information (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="speaker_name">Speaker Name</Label>
                                    <Input id="speaker_name" name="speaker_name" value={formData.speaker_name} onChange={handleChange} placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="speaker_contact">Speaker Contact (Email/Website)</Label>
                                    <Input id="speaker_contact" name="speaker_contact" value={formData.speaker_contact} onChange={handleChange} placeholder="speaker@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="speaker_image">Speaker Image URL</Label>
                                <Input id="speaker_image" name="speaker_image" value={formData.speaker_image} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="speaker_bio">Speaker Bio</Label>
                                <Textarea id="speaker_bio" name="speaker_bio" value={formData.speaker_bio} onChange={handleChange} rows={3} placeholder="Brief bio about the speaker..." />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Update Event' : 'Create Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

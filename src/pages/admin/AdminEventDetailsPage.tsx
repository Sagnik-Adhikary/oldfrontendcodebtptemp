import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Download, Search } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { toast } from 'react-hot-toast'
import type { EventAttendee } from '../../types'

export const AdminEventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useAuth()
    const [attendees, setAttendees] = useState<EventAttendee[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/admin/events/${id}/attendees`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setAttendees(data)
                }
            } catch (error) {
                console.error('Error fetching attendees:', error)
                toast.error('Failed to load attendees')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchAttendees()
        }
    }, [id, token])

    const filteredAttendees = attendees.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleExport = () => {
        // Convert to CSV
        const headers = ['Name', 'Email', 'Enrolled Date']
        const csvContent = [
            headers.join(','),
            ...filteredAttendees.map(a => [
                `"${a.name}"`, 
                `"${a.email}"`, 
                `"${new Date(a.enrolled_at).toLocaleDateString()}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `event_${id}_attendees.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link to="/admin/events" className="flex items-center text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Events
                    </Link>
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Event Attendees</h1>
                        <p className="text-gray-500">Managing {attendees.length} participants</p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search attendees..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Enrolled Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAttendees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                        No attendees found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAttendees.map((attendee) => (
                                    <TableRow key={attendee.id}>
                                        <TableCell className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={attendee.avatar} />
                                                <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{attendee.name}</span>
                                        </TableCell>
                                        <TableCell>{attendee.email}</TableCell>
                                        <TableCell>
                                            {new Date(attendee.enrolled_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
    Sparkles,
    Trophy,
    GraduationCap,
    MapPin,
    Briefcase,
    Building,
    Linkedin,
    Github,
    Mail,
    UserPlus
} from 'lucide-react'
import { getApiUrl } from '../config'
import { useAuth } from '../contexts/AuthContext'
import { ProfileModal } from './ProfileModal'
import { Textarea } from './ui/textarea'
import { X, Loader2 } from 'lucide-react'

interface RecommendedAlumni {
    id: number
    name: string
    email: string
    graduation_year?: number
    department?: string
    bio?: string
    current_company?: string
    current_position?: string
    location?: string
    work_preference?: string
    linkedin?: string
    github?: string
    years_of_experience?: number
    domain?: string
    tech_skills?: string[]
    score: number
    matching_criteria: string[]
    is_available?: boolean
}

export const RecommendedMentors: React.FC = () => {
    const { token } = useAuth()
    const [mentors, setMentors] = useState<RecommendedAlumni[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedAlumni, setSelectedAlumni] = useState<number | null>(null)
    const [showMentorshipModal, setShowMentorshipModal] = useState(false)
    const [mentorshipAlumniId, setMentorshipAlumniId] = useState<number | null>(null)
    const [mentorshipMessage, setMentorshipMessage] = useState('')
    const [sendingRequest, setSendingRequest] = useState(false)

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await fetch(getApiUrl('/api/mentors/recommended'), {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setMentors(data)
                }
            } catch (error) {
                console.error('Error fetching recommended mentors:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecommended()
    }, [token])

    const handleRequestMentorship = (alumniId: number) => {
        setMentorshipAlumniId(alumniId)
        setShowMentorshipModal(true)
    }

    const sendMentorshipRequest = async () => {
        if (!mentorshipMessage.trim() || !mentorshipAlumniId) return

        setSendingRequest(true)
        try {
            const res = await fetch(getApiUrl('/api/mentorship/request'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    alumni_id: mentorshipAlumniId,
                    message: mentorshipMessage
                })
            })

            if (res.ok) {
                alert('Mentorship request sent successfully!')
                setShowMentorshipModal(false)
                setMentorshipMessage('')
                setMentorshipAlumniId(null)
            } else {
                const error = await res.json()
                alert(error.error || 'Failed to send request')
            }
        } catch (error) {
            console.error('Error sending mentorship request:', error)
            alert('Failed to send request')
        } finally {
            setSendingRequest(false)
        }
    }

    if (loading) return null
    if (mentors.length === 0) return null

    return (
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((alumnus) => (
                    <Card
                        key={alumnus.id}
                        className="shadow-lg border-2 border-purple-100 hover:border-purple-300 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Recommendation Badge */}
                        <div className="absolute top-0 right-0 p-2 z-20">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm">
                                <Trophy className="h-3 w-3 mr-1" />
                                {alumnus.score} Points
                            </Badge>
                        </div>

                        <CardHeader className="relative z-10 pt-8">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border-2 border-purple-200">
                                    <AvatarImage
                                        src={alumnus.email ? getApiUrl(`/api/profile/picture/${alumnus.email}`) : undefined}
                                        alt={alumnus.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                                        {alumnus.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 truncate">{alumnus.name}</h3>
                                    {alumnus.current_position && (
                                        <p className="text-sm text-gray-600 truncate">{alumnus.current_position}</p>
                                    )}
                                    {alumnus.current_company && (
                                        <p className="text-sm text-purple-600 font-medium truncate">{alumnus.current_company}</p>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-4">
                            {/* Match Reasons */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {alumnus.matching_criteria.map((criteria, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                        {criteria}
                                    </Badge>
                                ))}
                            </div>

                            {/* Info badges */}
                            <div className="flex flex-wrap gap-2">
                                {alumnus.is_available !== undefined && (
                                    <Badge
                                        variant={alumnus.is_available ? "default" : "secondary"}
                                        className={`text-xs ${alumnus.is_available ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
                                    >
                                        {alumnus.is_available ? '✓ Available' : 'Not Available'}
                                    </Badge>
                                )}
                                {alumnus.graduation_year && (
                                    <Badge variant="secondary" className="text-xs">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        Class of {alumnus.graduation_year}
                                    </Badge>
                                )}
                                {alumnus.department && (
                                    <Badge variant="secondary" className="text-xs">
                                        {alumnus.department}
                                    </Badge>
                                )}
                            </div>

                            {/* Additional info */}
                            <div className="space-y-2 text-sm">
                                {alumnus.location && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4 text-purple-500" />
                                        <span className="truncate">{alumnus.location}</span>
                                    </div>
                                )}
                                {alumnus.domain && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                        <span className="truncate">{alumnus.domain}</span>
                                    </div>
                                )}
                                {alumnus.years_of_experience !== undefined && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building className="h-4 w-4 text-green-500" />
                                        <span>{alumnus.years_of_experience} years experience</span>
                                    </div>
                                )}
                            </div>

                            {/* Bio preview */}
                            {alumnus.bio && (
                                <p className="text-sm text-gray-600 line-clamp-2">{alumnus.bio}</p>
                            )}

                            {/* Tech skills */}
                            {alumnus.tech_skills && alumnus.tech_skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {alumnus.tech_skills.slice(0, 3).map((skill, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {alumnus.tech_skills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{alumnus.tech_skills.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Social links */}
                            <div className="flex gap-2 pt-2">
                                {alumnus.linkedin && (
                                    <a
                                        href={alumnus.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                                    >
                                        <Linkedin className="h-4 w-4 text-blue-600" />
                                    </a>
                                )}
                                {alumnus.github && (
                                    <a
                                        href={alumnus.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <Github className="h-4 w-4 text-gray-700" />
                                    </a>
                                )}
                                {alumnus.email && (
                                    <a
                                        href={`mailto:${alumnus.email}`}
                                        className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                                    >
                                        <Mail className="h-4 w-4 text-purple-600" />
                                    </a>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => setSelectedAlumni(alumnus.id)}
                                    variant="outline"
                                    className="flex-1 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                                >
                                    View Profile
                                </Button>
                                <Button
                                    onClick={() => handleRequestMentorship(alumnus.id)}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Request Mentorship
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Profile Modal */}
            {selectedAlumni && (
                <ProfileModal
                    userId={selectedAlumni}
                    isOpen={!!selectedAlumni}
                    onClose={() => setSelectedAlumni(null)}
                />
            )}

            {/* Mentorship Request Modal */}
            {showMentorshipModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowMentorshipModal(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Request Mentorship</h2>
                            <Button
                                onClick={() => setShowMentorshipModal(false)}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Send a mentorship request to connect with this alumni. Include a brief message about why you'd like their guidance.
                        </p>
                        <Textarea
                            placeholder="Write your message here..."
                            value={mentorshipMessage}
                            onChange={(e) => setMentorshipMessage(e.target.value)}
                            rows={5}
                            className="mb-4"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowMentorshipModal(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={sendMentorshipRequest}
                                disabled={!mentorshipMessage.trim() || sendingRequest}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                                {sendingRequest ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Request'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

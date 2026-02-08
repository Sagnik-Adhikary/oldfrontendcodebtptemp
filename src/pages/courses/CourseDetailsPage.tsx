import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../config'
import type { Course } from '../../types/course'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog'
import { toast } from 'react-hot-toast'
import { Loader2, Calendar, Clock, BookOpen } from 'lucide-react'

export const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    useEffect(() => {
        if (id) fetchCourseDetails()
    }, [id])

    const fetchCourseDetails = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(getApiUrl(`/api/courses/${id}`))
            if (res.ok) {
                const data = await res.json()
                setCourse(data)
            } else {
                toast.error('Course not found')
                navigate('/courses')
            }
        } catch (error) {
            console.error('Error fetching course:', error)
            toast.error('Failed to load course details')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEnrollClick = () => {
        if (!user) {
            toast.error('Please login to enroll')
            navigate('/login')
            return
        }
        setIsPaymentModalOpen(true)
    }

    const handlePaymentSuccess = async () => {
        setIsProcessingPayment(true)
        try {
            const res = await fetch(getApiUrl(`/api/courses/${id}/enroll`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                toast.success('Successfully enrolled!')
                setIsPaymentModalOpen(false)
                // Optionally refresh or redirect
            } else {
                const errorData = await res.json()
                toast.error(errorData.error || 'Enrollment failed')
            }
        } catch (error) {
            console.error('Enrollment error:', error)
            toast.error('Something went wrong')
        } finally {
            setIsProcessingPayment(false)
        }
    }

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
    if (!course) return null

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Image and Key Info */}
                    <div className="md:w-1/3 space-y-6">
                        {course.image_url && (
                             <img 
                                src={course.image_url} 
                                alt={course.title} 
                                className="w-full h-auto rounded-lg object-cover shadow-sm"
                            />
                        )}
                        
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">Duration:</span> {course.duration || 'N/A'}
                            </div>
                             <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">Start Date:</span> {course.start_date ? new Date(course.start_date).toLocaleDateString() : 'Self-paced'}
                            </div>
                             <div className="flex items-center gap-2 text-gray-700">
                                <BookOpen className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">Category:</span> {course.category}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                {course.price ? `₹${course.price}` : 'Free'}
                            </div>
                            <Button size="lg" className="w-full" onClick={handleEnrollClick}>
                                Apply Now / Enroll
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:w-2/3 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
                        </div>

                        {course.perks && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Perks</h3>
                                <div className="prose text-gray-600 whitespace-pre-line">{course.perks}</div>
                            </div>
                        )}

                        {course.timeline && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Timeline</h3>
                                <div className="prose text-gray-600 whitespace-pre-line">{course.timeline}</div>
                            </div>
                        )}

                         {course.assignments && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Assignments</h3>
                                <div className="prose text-gray-600 whitespace-pre-line">{course.assignments}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Enrollment</DialogTitle>
                        <DialogDescription>
                            This is a demo payment screen. Confirming will enroll you in <strong>{course.title}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span>Total Amount:</span>
                            <span className="font-bold text-lg">{course.price ? `₹${course.price}` : 'Free'}</span>
                        </div>
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                            Payment Gateway Placeholder
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                        <Button onClick={handlePaymentSuccess} disabled={isProcessingPayment}>
                            {isProcessingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Confirm Payment & Enroll
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
    Loader2, Clock, BookOpen, GraduationCap, ChevronRight, User, ArrowLeft
} from 'lucide-react'

interface EnrolledCourse {
    id: number
    title: string
    description: string
    category: string
    image_url?: string
    duration?: string
    instructor_name?: string
    instructor_image?: string
    enrollment_status: string
    enrolled_at: string
}

export const MyCoursesPage: React.FC = () => {
    const { user, token, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [courses, setCourses] = useState<EnrolledCourse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login')
            return
        }
        if (token) {
            fetchEnrolledCourses()
        }
    }, [token, authLoading, user])

    const fetchEnrolledCourses = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(getApiUrl('/api/users/enrolled-courses'), {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setCourses(data)
            }
        } catch (error) {
            console.error('Error fetching enrolled courses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Waiting for Approval</Badge>
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
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
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                            <p className="text-slate-600">Track your enrolled courses and application status</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                    </div>
                ) : courses.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {courses.map((course, idx) => (
                            <motion.div 
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to={`/courses/${course.id}`} className="block group">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                        {/* Course Image */}
                                        <div className="relative h-40 overflow-hidden">
                                            {course.image_url ? (
                                                <img 
                                                    src={course.image_url} 
                                                    alt={course.title} 
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                                    <BookOpen className="h-12 w-12 text-white/50" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                {getStatusBadge(course.enrollment_status)}
                                            </div>
                                        </div>
                                        
                                        {/* Course Content */}
                                        <div className="p-5">
                                            <Badge variant="outline" className="mb-2">{course.category}</Badge>
                                            <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                {course.title}
                                            </h3>
                                            
                                            {/* Instructor */}
                                            {course.instructor_name && (
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                                                        {course.instructor_image ? (
                                                            <img src={course.instructor_image} alt={course.instructor_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-slate-600">{course.instructor_name}</span>
                                                </div>
                                            )}
                                            
                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                                                {course.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                )}
                                                <span className="text-xs">Enrolled {new Date(course.enrolled_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <GraduationCap className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No enrolled courses yet</h3>
                        <p className="text-slate-500 mb-6">Explore our courses and start learning today!</p>
                        <Button asChild className="bg-purple-600 hover:bg-purple-700">
                            <Link to="/courses">
                                Browse Courses <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

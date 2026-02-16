import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl } from '../../config'
import type { Course } from '../../types/course'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '../../components/ui/dialog'
import { toast } from 'react-hot-toast'
import { 
    Loader2, Clock, CheckCircle, Users, Play, Award, Star, User, 
    ChevronDown, ChevronRight, Monitor, FileText, Download, Globe, Lock
} from 'lucide-react'

export const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
    const [isProcessingEnrollment, setIsProcessingEnrollment] = useState(false)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [activeTab, setActiveTab] = useState<'about' | 'outline' | 'outcomes'>('about')
    const [expandedModules, setExpandedModules] = useState<number[]>([0])

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
            toast.error('Please login to apply')
            navigate('/login')
            return
        }
        setIsEnrollModalOpen(true)
    }

    const handleEnrollConfirm = async () => {
        setIsProcessingEnrollment(true)
        try {
            const res = await fetch(getApiUrl(`/api/courses/${id}/enroll`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                toast.success('Application submitted! Waiting for approval.')
                setIsEnrollModalOpen(false)
                setIsEnrolled(true)
            } else {
                const errorData = await res.json()
                if (errorData.error?.includes('Already enrolled')) {
                    setIsEnrolled(true)
                    setIsEnrollModalOpen(false)
                } else {
                    toast.error(errorData.error || 'Application failed')
                }
            }
        } catch (error) {
            console.error('Enrollment error:', error)
            toast.error('Something went wrong')
        } finally {
            setIsProcessingEnrollment(false)
        }
    }

    const toggleModule = (index: number) => {
        setExpandedModules(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    // Parse data
    const learningPoints = course?.what_you_learn?.split('\n').filter(Boolean) || []
    const requirementPoints = course?.requirements?.split('\n').filter(Boolean) || []
    const lessonItems = course?.lessons?.split('\n').filter(Boolean) || []
    const skillTags = course?.skill_tags?.split(',').map(s => s.trim()).filter(Boolean) || []

    // Generate mock lesson details for each module
    const generateLessonDetails = (moduleName: string, moduleIndex: number) => {
        const baseDurations = [8, 10, 12, 15, 7, 9, 11, 14]
        return [
            { title: `Introduction to ${moduleName}`, duration: `${baseDurations[moduleIndex % 8]}:00`, isPreview: moduleIndex === 0 },
            { title: 'Core concepts and fundamentals', duration: `${baseDurations[(moduleIndex + 1) % 8]}:30`, isPreview: false },
            { title: 'Practical application', duration: `${baseDurations[(moduleIndex + 2) % 8]}:45`, isPreview: false },
            { title: 'Summary and key takeaways', duration: `${baseDurations[(moduleIndex + 3) % 8]}:15`, isPreview: false },
        ]
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        )
    }
    
    if (!course) return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header - Dark Blue */}
            <section className="bg-[#1a1a4e]" style={{ paddingTop: '100px', paddingBottom: '32px' }}>
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-300">{course.category}</span>
                    </nav>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left - Course Info */}
                        <div className="lg:col-span-2">
                            <Badge className="mb-3 bg-indigo-600 text-white border-0 text-xs px-3 py-1">
                                {course.category}
                            </Badge>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                {course.title}
                            </h1>
                            
                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                                <div className="flex items-center gap-1">
                                    <div className="flex">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                                        ))}
                                    </div>
                                    <span className="ml-1">(4.0)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>1,250 Students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration || '8 hours'}</span>
                                </div>
                            </div>
                            
                            {/* Instructor Badge */}
                            {course.instructor_name && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
                                        {course.instructor_image ? (
                                            <img src={course.instructor_image} alt={course.instructor_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-5 w-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{course.instructor_name}</p>
                                        <p className="text-gray-400 text-xs">Course Instructor</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Main Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="flex border-b border-gray-200">
                                    {[
                                        { key: 'about', label: 'About' },
                                        { key: 'outline', label: 'Course Outline' },
                                        { key: 'outcomes', label: 'Outcomes' }
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                                                activeTab === tab.key 
                                                    ? 'text-indigo-600' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.key && (
                                                <motion.div 
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                                    layoutId="activeTab"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'about' && (
                                    <motion.div 
                                        key="about"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        {/* About This Course */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">About this course</h2>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                                                {course.description}
                                            </p>
                                            {course.perks && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-gray-600 whitespace-pre-line text-sm">{course.perks}</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* What you'll learn */}
                                        {learningPoints.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h2 className="text-lg font-bold text-gray-900 mb-4">What you'll learn in this online course?</h2>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    {learningPoints.map((point, idx) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-sm">{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Skills you'll gain */}
                                        {skillTags.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h2 className="text-lg font-bold text-gray-900 mb-4">Skills you'll gain</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {skillTags.map((skill, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-default"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Requirements */}
                                        {requirementPoints.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                                                <ul className="space-y-2">
                                                    {requirementPoints.map((req, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {/* What's in this course - Accordion */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-lg font-bold text-gray-900 mb-4">What's in this course?</h2>
                                            <div className="space-y-3">
                                                {lessonItems.length > 0 ? lessonItems.map((lesson, idx) => {
                                                    const lessonDetails = generateLessonDetails(lesson, idx)
                                                    const isExpanded = expandedModules.includes(idx)
                                                    
                                                    return (
                                                        <div 
                                                            key={idx}
                                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => toggleModule(idx)}
                                                                className={`w-full flex items-center justify-between p-4 transition-colors text-left ${isExpanded ? 'bg-indigo-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                        {idx + 1}
                                                                    </div>
                                                                    <span className={`font-medium ${isExpanded ? 'text-indigo-700' : 'text-gray-800'}`}>{lesson}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs text-gray-500">{lessonDetails.length} lessons</span>
                                                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                                </div>
                                                            </button>
                                                            
                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div 
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="bg-white border-t border-gray-100"
                                                                    >
                                                                        <div className="p-4 space-y-0">
                                                                            {lessonDetails.map((detail, dIdx) => (
                                                                                <div 
                                                                                    key={dIdx} 
                                                                                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        {detail.isPreview ? (
                                                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                                <Play className="h-4 w-4 text-indigo-600" />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                                                <Lock className="h-4 w-4 text-gray-400" />
                                                                                            </div>
                                                                                        )}
                                                                                        <span className="text-gray-700 text-sm">{detail.title}</span>
                                                                                        {detail.isPreview && (
                                                                                            <Badge className="bg-green-100 text-green-700 text-xs border-0">Preview</Badge>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                                        <Clock className="h-4 w-4" />
                                                                                        <span>{detail.duration}</span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )
                                                }) : (
                                                    <p className="text-gray-500 text-center py-8">Course outline coming soon</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Who will you learn with - Instructors */}
                                        {course.instructor_name && (
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h2 className="text-lg font-bold text-gray-900 mb-6">Who will you learn with?</h2>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {/* Main Instructor */}
                                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {course.instructor_image ? (
                                                                <img src={course.instructor_image} alt={course.instructor_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="h-8 w-8 text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{course.instructor_name}</h3>
                                                            <p className="text-indigo-600 text-sm mb-1">Lead Instructor</p>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                                <span>4.9 Rating</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Second Instructor (placeholder) */}
                                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            <User className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
                                                            <p className="text-indigo-600 text-sm mb-1">Teaching Assistant</p>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                                <span>4.8 Rating</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {course.instructor_bio && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-gray-600 text-sm">{course.instructor_bio}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {activeTab === 'outline' && (
                                    <motion.div 
                                        key="outline"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
                                                <span className="text-sm text-gray-500">{lessonItems.length} modules • {course.duration || '8 hours'}</span>
                                            </div>
                                            <div className="space-y-3">
                                                {lessonItems.length > 0 ? lessonItems.map((lesson, idx) => {
                                                    const lessonDetails = generateLessonDetails(lesson, idx)
                                                    const isExpanded = expandedModules.includes(idx)
                                                    
                                                    return (
                                                        <div 
                                                            key={idx}
                                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => toggleModule(idx)}
                                                                className={`w-full flex items-center justify-between p-4 transition-colors text-left ${isExpanded ? 'bg-indigo-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                        {idx + 1}
                                                                    </div>
                                                                    <span className={`font-medium ${isExpanded ? 'text-indigo-700' : 'text-gray-800'}`}>{lesson}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs text-gray-500">{lessonDetails.length} lessons</span>
                                                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                                </div>
                                                            </button>
                                                            
                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div 
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="bg-white border-t border-gray-100"
                                                                    >
                                                                        <div className="p-4 space-y-0">
                                                                            {lessonDetails.map((detail, dIdx) => (
                                                                                <div 
                                                                                    key={dIdx} 
                                                                                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        {detail.isPreview ? (
                                                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                                                <Play className="h-4 w-4 text-indigo-600" />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                                                <Lock className="h-4 w-4 text-gray-400" />
                                                                                            </div>
                                                                                        )}
                                                                                        <span className="text-gray-700 text-sm">{detail.title}</span>
                                                                                        {detail.isPreview && (
                                                                                            <Badge className="bg-green-100 text-green-700 text-xs border-0">Preview</Badge>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                                        <Clock className="h-4 w-4" />
                                                                                        <span>{detail.duration}</span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )
                                                }) : (
                                                    <p className="text-gray-500 text-center py-8">Course outline coming soon</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {activeTab === 'outcomes' && (
                                    <motion.div 
                                        key="outcomes"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Outcomes</h2>
                                            {learningPoints.length > 0 ? (
                                                <div className="space-y-3">
                                                    {learningPoints.map((point, idx) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <Award className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-sm">{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Complete this course to gain practical skills and knowledge.</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Right Sidebar - Enrollment Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                                {/* Video Preview */}
                                <div className="relative aspect-video bg-gray-900">
                                    {course.image_url ? (
                                        <img 
                                            src={course.image_url} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                            <Play className="h-12 w-12 text-white/50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                            <Play className="h-6 w-6 text-indigo-600 ml-1" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    {/* Price */}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {course.price ? `₹${course.price}` : 'Free'}
                                        </span>
                                        {course.price && (
                                            <span className="text-lg text-gray-400 line-through">
                                                ₹{Math.round(Number(course.price) * 1.5)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Enroll Button */}
                                    {isEnrolled ? (
                                        <div className="mb-5">
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                                                <div className="flex items-center justify-center gap-2 text-amber-700 mb-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-medium text-sm">Applied</span>
                                                </div>
                                                <p className="text-amber-600 text-xs">Waiting for approval</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            size="lg" 
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 text-base font-semibold rounded-lg mb-5"
                                            onClick={handleEnrollClick}
                                        >
                                            Enroll Now
                                        </Button>
                                    )}
                                    
                                    {/* Course Features */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <p className="font-medium text-gray-800 text-sm">This course includes:</p>
                                        {[
                                            { icon: Monitor, text: `${course.lessons_count || 12} on-demand videos` },
                                            { icon: FileText, text: 'Downloadable resources' },
                                            { icon: Download, text: 'Access on mobile & TV' },
                                            { icon: Award, text: 'Certificate of completion' },
                                            { icon: Globe, text: 'Full lifetime access' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <item.icon className="h-4 w-4 text-indigo-500" />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enroll Confirmation Modal */}
            <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Apply for this Course</DialogTitle>
                        <DialogDescription>
                            Submit your application for <strong>{course.title}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Course Fee:</span>
                            <span className="font-bold text-lg text-gray-800">
                                {course.price ? `₹${course.price}` : 'Free'}
                            </span>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm text-amber-700">
                                <strong>Note:</strong> After applying, your status will be "Waiting for Approval".
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEnrollModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleEnrollConfirm} 
                            disabled={isProcessingEnrollment}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isProcessingEnrollment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

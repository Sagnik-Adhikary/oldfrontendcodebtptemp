import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getApiUrl } from '../../config'
import type { Course } from '../../types/course'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { 
    Loader2, Search, Clock, BookOpen, 
    Palette, Code, Camera, Brain, TrendingUp, Database, Music, ChevronRight
} from 'lucide-react'

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
    'Design': <Palette className="h-6 w-6" />,
    'IT & Software': <Code className="h-6 w-6" />,
    'Photography': <Camera className="h-6 w-6" />,
    'Personal Development': <Brain className="h-6 w-6" />,
    'Marketing': <TrendingUp className="h-6 w-6" />,
    'Database': <Database className="h-6 w-6" />,
    'Music': <Music className="h-6 w-6" />,
}

const categories = [
    'Design', 'IT & Software', 'Photography', 'Personal Development', 'Marketing', 'Database', 'Music'
]

export const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchCourses()
    }, [searchQuery, selectedCategory])

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const queryParams = new URLSearchParams()
            if (searchQuery) queryParams.append('search', searchQuery)
            if (selectedCategory) queryParams.append('category', selectedCategory)

            const res = await fetch(getApiUrl(`/api/courses?${queryParams.toString()}`))
            if (res.ok) {
                const data = await res.json()
                setCourses(data)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-50 via-violet-100/50 to-white pt-32 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-200 rounded-full filter blur-3xl" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div 
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 px-4 py-1">
                            Let's Start Learning
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Let's Learn New Course &<br />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Gain More Skills
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Explore our comprehensive courses designed by industry experts. Transform your career with hands-on learning experiences.
                        </p>
                        
                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input 
                                placeholder="Search for courses..." 
                                className="pl-12 pr-4 py-6 text-base bg-white/80 backdrop-blur-md border-purple-100 text-gray-900 placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        {[
                            { value: '350+', label: 'Courses' },
                            { value: '25K+', label: 'Students' },
                            { value: '150+', label: 'Expert Instructors' },
                            { value: '98%', label: 'Satisfaction Rate' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-md border border-purple-100 shadow-sm">
                                <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Category Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Browse By Category</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Choose from a variety of categories and find the perfect course for you</p>
                    </div>
                    
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.button
                            onClick={() => setSelectedCategory(null)}
                            variants={itemVariants}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                                selectedCategory === null 
                                    ? 'border-purple-500 bg-purple-50 shadow-lg' 
                                    : 'border-slate-200 bg-white hover:border-purple-300'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                                selectedCategory === null ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <span className={`text-sm font-medium ${selectedCategory === null ? 'text-purple-700' : 'text-slate-700'}`}>
                                All Courses
                            </span>
                        </motion.button>
                        
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                variants={itemVariants}
                                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                                    selectedCategory === cat 
                                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                                        : 'border-slate-200 bg-white hover:border-purple-300'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                                    selectedCategory === cat ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {categoryIcons[cat]}
                                </div>
                                <span className={`text-sm font-medium ${selectedCategory === cat ? 'text-purple-700' : 'text-slate-700'}`}>
                                    {cat}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Courses Grid Section */}
            <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'}
                            </h2>
                            <p className="text-slate-600">
                                {courses.length} course{courses.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                        </div>
                    ) : courses.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {courses.map(course => (
                                <motion.div key={course.id} variants={itemVariants}>
                                    <Link to={`/courses/${course.id}`} className="block group">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                            {/* Course Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                {course.image_url ? (
                                                    <img 
                                                        src={course.image_url} 
                                                        alt={course.title} 
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                                        <BookOpen className="h-16 w-16 text-white/50" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 text-slate-700 backdrop-blur-sm">
                                                        {course.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            
                                            {/* Course Content */}
                                            <div className="p-5">
                                                <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                    {course.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                                    {course.description}
                                                </p>
                                                
                                                {/* Instructor */}
                                                {course.instructor_name && (
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                                                            {course.instructor_image ? (
                                                                <img src={course.instructor_image} alt={course.instructor_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-white text-sm font-medium">
                                                                    {course.instructor_name.charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-slate-600">{course.instructor_name}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Meta Info */}
                                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                                    {course.duration && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{course.duration}</span>
                                                        </div>
                                                    )}
                                                    {course.lessons_count ? (
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>{course.lessons_count} Lessons</span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                                
                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        {course.price ? (
                                                            <>
                                                                <span className="text-xl font-bold text-purple-600">₹{course.price}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xl font-bold text-green-600">Free</span>
                                                        )}
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="group-hover:bg-purple-100 group-hover:text-purple-700">
                                                        View Course <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>
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
                                <BookOpen className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of students already learning on our platform. Get access to expert-led courses and start building your skills today.
                        </p>
                        <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold rounded-xl">
                            Explore All Courses
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

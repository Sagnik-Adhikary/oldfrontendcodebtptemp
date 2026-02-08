import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../../config'
import type { Course } from '../../types/course'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Loader2, Search, Clock, Calendar } from 'lucide-react'

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



    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                        placeholder="Search courses..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Add Category Filter Dropdown if needed, for now just buttons/badges */}
            </div>

             {/* Categories (derived from data or predefined) */}
             <div className="flex flex-wrap gap-2 mb-8">
                <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                >
                    All
                </Button>
                {['Technical', 'Business', 'Design', 'Marketing'].map(cat => (
                    <Button
                         key={cat}
                         variant={selectedCategory === cat ? "default" : "outline"}
                         onClick={() => setSelectedCategory(cat)}
                         size="sm"
                    >
                        {cat}
                    </Button>
                ))}
             </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            {course.image_url && (
                                <div className="h-48 w-full overflow-hidden rounded-t-lg">
                                    <img 
                                        src={course.image_url} 
                                        alt={course.title} 
                                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary">{course.category}</Badge>
                                    {course.price ? (
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                            ₹{course.price}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                                            Free
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                    {course.duration && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {course.duration}
                                        </div>
                                    )}
                                    {course.start_date && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(course.start_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild>
                                    <Link to={`/courses/${course.id}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No courses found matching your criteria.
                </div>
            )}
        </div>
    )
}

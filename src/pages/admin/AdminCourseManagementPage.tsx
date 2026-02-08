import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import type { Course, Enrollment } from '../../types/course'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const AdminCourseManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useAuth()
    const [course, setCourse] = useState<Course | null>(null)
    const [students, setStudents] = useState<Enrollment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (id) fetchData()
    }, [id])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [courseRes, studentsRes] = await Promise.all([
                fetch(getApiUrl(`/api/courses/${id}`)),
                fetch(getApiUrl(`/api/admin/courses/${id}/students`), {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ])

            if (courseRes.ok) {
                const courseData = await courseRes.json()
                setCourse(courseData)
            }
            
            if (studentsRes.ok) {
                const studentsData = await studentsRes.json()
                setStudents(studentsData)
            }

        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load course details')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
    if (!course) return <div className="container mx-auto p-4">Course not found</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-4 pl-0" asChild>
                <Link to="/admin/courses">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Courses
                </Link>
            </Button>

            <div className="flex justify-between items-start mb-8">
                <div>
                     <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                     <div className="flex gap-2">
                        <Badge>{course.category}</Badge>
                        <Badge variant="outline">{course.duration}</Badge>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{students.length}</div>
                    <div className="text-gray-500">Enrolled Students</div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                    {students.length > 0 ? (
                        <div className="divide-y">
                            {students.map(student => (
                                <div key={student.id} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={student.avatar ? getApiUrl(`/api/profile/picture/${student.avatar}`) : undefined} />
                                            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {student.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-right">
                                            <div className="text-gray-900 font-medium capitalize">{student.payment_status}</div>
                                            <div className="text-gray-500 text-xs">
                                                Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Badge variant={
                                            student.status === 'approved' ? 'default' : 
                                            student.status === 'rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {student.status}
                                        </Badge>
                                        {/* Add Approve/Reject buttons here if needed */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No students enrolled yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

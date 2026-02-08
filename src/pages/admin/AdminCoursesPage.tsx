import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import type { Course } from '../../types/course'
import { Button } from '../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'react-hot-toast'
import { Loader2, Plus, Users, Pencil } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'

export const AdminCoursesPage: React.FC = () => {
    const { token } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingCourseId, setEditingCourseId] = useState<number | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical',
        perks: '',
        timeline: '',
        duration: '',
        assignments: '',
        price: '',
        start_date: '',
        image_url: ''
    })

    useEffect(() => {
        fetchAdminCourses()
    }, [])

    const fetchAdminCourses = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(getApiUrl('/api/admin/courses'), {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setCourses(data)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
            toast.error('Failed to load courses')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateOrUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const url = isEditMode && editingCourseId 
            ? getApiUrl(`/api/courses/${editingCourseId}`)
            : getApiUrl('/api/courses')
            
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
                toast.success(isEditMode ? 'Course updated successfully' : 'Course created successfully')
                setIsCreateModalOpen(false)
                fetchAdminCourses()
                resetForm()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to save course')
            }
        } catch (error) {
            console.error('Save course error:', error)
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Technical',
            perks: '',
            timeline: '',
            duration: '',
            assignments: '',
            price: '',
            start_date: '',
            image_url: ''
        })
        setIsEditMode(false)
        setEditingCourseId(null)
    }

    const openEditModal = (course: Course) => {
        setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            perks: course.perks || '',
            timeline: course.timeline || '',
            duration: course.duration || '',
            assignments: course.assignments || '',
            price: course.price?.toString() || '',
            start_date: course.start_date || '',
            image_url: course.image_url || ''
        })
        setIsEditMode(true)
        setEditingCourseId(course.id)
        setIsCreateModalOpen(true)
    }

    const openCreateModal = () => {
        resetForm()
        setIsCreateModalOpen(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Courses</h1>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Course
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span className="line-clamp-1" title={course.title}>{course.title}</span>
                                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {course.category}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>{course.enrollment_count || 0} Students Enrolled</span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Created: {new Date(course.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(course)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" className="flex-1" asChild>
                                            <Link to={`/admin/courses/${course.id}`}>Manage Students</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Course Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateOrUpdateCourse} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title *</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select 
                                    value={formData.category} 
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technical">Technical</SelectItem>
                                        <SelectItem value="Business">Business</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" placeholder="e.g. 4 weeks" value={formData.duration} onChange={handleChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Image URL</Label>
                            <Input id="image_url" name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} />
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="perks">Perks</Label>
                            <Textarea id="perks" name="perks" placeholder="List perks..." value={formData.perks} onChange={handleChange} />
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline</Label>
                            <Textarea id="timeline" name="timeline" placeholder="Week 1: ..., Week 2: ..." value={formData.timeline} onChange={handleChange} />
                        </div>
                        
                         <div className="space-y-2">
                            <Label htmlFor="assignments">Assignments</Label>
                            <Textarea id="assignments" name="assignments" placeholder="Details about assignments..." value={formData.assignments} onChange={handleChange} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Update Course' : 'Create Course'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

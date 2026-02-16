import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { ServiceCard } from '../../components/launchpad/ServiceCard'
import type { Service } from '../../types'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'

export const LaunchpadPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async (query = '') => {
    try {
      setLoading(true)
      const url = query 
        ? getApiUrl(`/api/launchpad/services?search=${encodeURIComponent(query)}`)
        : getApiUrl('/api/launchpad/services')
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchServices(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-20">
      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-100/50 to-violet-50 text-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Launch your next big idea with verified services
              </h1>
              <p className="text-lg text-gray-600">
                Find trusted agencies and freelancers from our alumni network or submit your project to get matched with the perfect team.
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-lg mt-6">
                <Input 
                  type="text" 
                  placeholder="What service are you looking for?" 
                  className="pl-12 py-6 rounded-full text-gray-900 border-0 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                >
                  Search
                </Button>
              </form>
            </div>
            
            {/* Fixed Top Card "Take launchpad services" */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-indigo-100 shadow-xl max-w-md w-full">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Need a custom solution?</h3>
                  <p className="text-indigo-600 text-sm">Let us handle the heavy lifting</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Directly connect with our admin team to describe your project. We'll match you with the best available agencies and oversee the delivery.
              </p>
              <Button asChild size="lg" className="w-full bg-white text-indigo-900 hover:bg-gray-100 border-0 font-semibold">
                <Link to="/launchpad/submit-project">
                  Take Launchpad Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Explore Services</h2>
          {/* Filter options could go here */}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-600 font-medium">No services found matching your criteria.</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}

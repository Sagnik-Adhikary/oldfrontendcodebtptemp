import React, { useState } from 'react'
import { Link } from 'react-router-dom'


import { Button } from '../components/ui/button'
import { StarsAnimation } from '../components/ui/stars-animation'



import { ProfileModal } from '../components/ProfileModal';
import {
  ArrowRight,
} from 'lucide-react'
import { ClientFeedback } from '../components/landing/ClientFeedback'




export const LandingPage: React.FC = () => {

    const [viewingAlumniId, setViewingAlumniId] = useState<number | null>(null);



  return (
    <div className="min-h-screen bg-white">

   



      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden py-20">
        {/* Stars Animation */}
        <StarsAnimation
          className="opacity-90"
          starCount={150}
          speed={1.5}
        />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-8 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-40 animate-bounce"></div>

        <div className="container mx-auto px-4 w-full z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              What is{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                KGP FORGE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              A collaborative platform connecting the brightest minds from IIT Kharagpur to share projects, find co-founders, mentors and build the next generation of startups.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-200/30 border-0" asChild>
                <Link to="/about">
                  About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </section>


      {/* Scroll Indicator Section */}
      <section className="py-2 flex justify-center">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>



      {/* Featured Projects */}
      

      {/* Alumni Success Stories */}
     

      {/* Client Feedback Section */}
      <ClientFeedback />

      {/* Call to action */}
     

      {/* Adding this Profile Modal at the end */}
      {viewingAlumniId && (
        <ProfileModal
          userId={viewingAlumniId}
          isOpen={!!viewingAlumniId}
          onClose={() => setViewingAlumniId(null)}
        />
      )}
    </div>
  )
}

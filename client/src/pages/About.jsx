import { Button } from '@/components/ui/button'
import React from 'react'

const AboutPage = () => {
  return (
    <section className="w-11/12 mx-auto pt-20 flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-700">About Us</h1>
      <p className="text-gray-600 mt-4">
        Welcome to our book recommendation app! We are passionate about books and believe in the power of reading to transform lives. Our mission is to help you discover your next favorite book, connect with fellow readers, and share your love for literature.
      </p>
      <p className="text-gray-600 mt-4">
        Whether you're looking for the latest bestsellers, hidden gems, or classic literature, we've got you covered. Join our community of book lovers and embark on a journey of discovery with us!
      </p>

      {/* Counters for books, users , and recommendations */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-8 bg-white/60 shadow-md rounded-lg px-6 py-4 border-l-6 border-primary">
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold text-2xl">1000+</p>
          <p className="text-sm">Books</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold text-2xl">500+</p>
          <p className="text-sm">Users</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold text-2xl">2000+</p>
          <p className="text-sm">Recommendations</p>
        </div>
      </div>
      {/* CTA Button to homepage */}
      <Button className="mt-6"  onClick={() => window.location.href = '/'}>
        Explore Books
      </Button>
    </section>
  )
}

export default AboutPage

import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='h-screen w-screen bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] flex items-center justify-center p-6'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
        <div className='flex flex-col items-center'>
          <img 
            className='w-20 mb-6' 
            src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" 
            alt="Uber Logo" 
          />
          <h2 className='text-3xl font-semibold text-center mb-6'>Get Started with Uber</h2>
          <Link 
            to='/login' 
            className='flex items-center justify-center w-full bg-black text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start
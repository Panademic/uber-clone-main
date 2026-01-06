import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ error, setError ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }

      const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
      console.log('Signup request:', { baseURL, newUser })
      const response = await axios.post(`${baseURL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        // Clear form fields on success
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setIsLoading(false)
        navigate('/home')
      }
    } catch (err) {
      console.error('Signup error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      })
      
      if (err.response && err.response.data) {
        // Handle validation errors (array format)
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const errorMessages = err.response.data.errors.map(error => error.msg).join(', ')
          setError(errorMessages)
        } 
        // Handle message format errors
        else if (err.response.data.message) {
          setError(err.response.data.message)
        } 
        else {
          setError(`Signup failed: ${JSON.stringify(err.response.data)}`)
        }
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Unable to connect to server. Please make sure the backend is running on http://localhost:3000')
      } else {
        setError(`Signup failed: ${err.message}`)
      }
      setIsLoading(false)
      // Don't clear form fields on error - let user see what they entered
    }
  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3'>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base disabled:opacity-50 disabled:cursor-not-allowed'
            >{isLoading ? 'Creating account...' : 'Create account'}</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default UserSignup
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (!captain?._id) {
            return
        }

        // Join socket room
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        // Set up location updates
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                }, (error) => {
                    console.error('Error getting location:', error)
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // Set up socket event listeners
        const handleNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }

        socket.on('new-ride', handleNewRide)

        // Cleanup
        return () => {
            clearInterval(locationInterval)
            socket.off('new-ride', handleNewRide)
        }
    }, [captain, socket])

    async function confirmRide() {
        if (!ride?._id || !captain?._id) {
            return
        }

        try {
            const baseURL = import.meta.env.BACKEND_URL || 'http://localhost:3000'
            await axios.post(`${baseURL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch (err) {
            console.error('Error confirming ride:', err)
            // You might want to show an error message to the user here
        }
    }


    useGSAP(function () {
        if (ridePopupPanelRef.current) {
            if (ridePopupPanel) {
                gsap.to(ridePopupPanelRef.current, {
                    transform: 'translateY(0)',
                    duration: 0.4,
                    ease: 'power2.out'
                })
            } else {
                gsap.to(ridePopupPanelRef.current, {
                    transform: 'translateY(100%)',
                    duration: 0.3,
                    ease: 'power2.in'
                })
            }
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanelRef.current) {
            if (confirmRidePopupPanel) {
                gsap.to(confirmRidePopupPanelRef.current, {
                    transform: 'translateY(0)',
                    duration: 0.4,
                    ease: 'power2.out'
                })
            } else {
                gsap.to(confirmRidePopupPanelRef.current, {
                    transform: 'translateY(100%)',
                    duration: 0.3,
                    ease: 'power2.in'
                })
            }
        }
    }, [ confirmRidePopupPanel ])

    if (!captain) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading captain details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen bg-gray-50'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-20'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to='/captain/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-shadow'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5 pt-20'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map" />
            </div>
            <div className='h-2/5 p-6 bg-white'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome
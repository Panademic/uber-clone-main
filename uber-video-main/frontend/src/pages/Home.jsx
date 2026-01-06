import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (user?._id) {
            socket.emit("join", { userType: "user", userId: user._id })
        }

        // Set up socket event listeners
        const handleRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }

        const handleRideStarted = (ride) => {
            console.log("ride started", ride)
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)

        // Cleanup listeners on unmount
        return () => {
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)
        }
    }, [ user, socket, navigate ])


    const handlePickupChange = async (e) => {
        const value = e.target.value
        setPickup(value)
        
        if (!value.trim()) {
            setPickupSuggestions([])
            return
        }

        try {
            const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
            const response = await axios.get(`${baseURL}/maps/get-suggestions`, {
                params: { input: value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data || [])
        } catch (err) {
            console.error('Error fetching pickup suggestions:', err)
            setPickupSuggestions([])
        }
    }

    const handleDestinationChange = async (e) => {
        const value = e.target.value
        setDestination(value)
        
        if (!value.trim()) {
            setDestinationSuggestions([])
            return
        }

        try {
            const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
            const response = await axios.get(`${baseURL}/maps/get-suggestions`, {
                params: { input: value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data || [])
        } catch (err) {
            console.error('Error fetching destination suggestions:', err)
            setDestinationSuggestions([])
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen && panelRef.current && panelCloseRef.current) {
            // Calculate max height to prevent overlap with logo (logo area is ~80px from top)
            // Leave some buffer space (20px) below logo
            const availableHeight = window.innerHeight - 100 // 80px logo + 20px buffer
            const maxHeight = Math.min(availableHeight * 0.65, availableHeight - 300) // Leave space for input panel
            gsap.to(panelRef.current, {
                height: `${maxHeight}px`,
                duration: 0.3,
                ease: 'power2.out'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1,
                duration: 0.2
            })
        } else if (panelRef.current && panelCloseRef.current) {
            gsap.to(panelRef.current, {
                height: '0px',
                duration: 0.3,
                ease: 'power2.in'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0,
                duration: 0.2
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        // Keep vehicle panel open if it's open OR if confirm panel is open (so user can go back)
        const shouldBeOpen = vehiclePanel || confirmRidePanel
        
        if (vehiclePanelRef.current) {
            if (shouldBeOpen) {
                gsap.to(vehiclePanelRef.current, {
                    transform: 'translateY(0)',
                    duration: 0.6,
                    ease: 'power2.out',
                    immediateRender: false
                })
            } else {
                gsap.to(vehiclePanelRef.current, {
                    transform: 'translateY(100%)',
                    duration: 0.4,
                    ease: 'power2.in',
                    immediateRender: false
                })
            }
        }
    }, [ vehiclePanel, confirmRidePanel ])

    useGSAP(function () {
        if (confirmRidePanel && confirmRidePanelRef.current) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power2.out'
            })
        } else if (confirmRidePanelRef.current) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound && vehicleFoundRef.current) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power2.out'
            })
        } else if (vehicleFoundRef.current) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver && waitingForDriverRef.current) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power2.out'
            })
        } else if (waitingForDriverRef.current) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        if (!pickup.trim() || !destination.trim()) {
            return
        }

        // Close location panel and ensure confirm panel is closed
        setPanelOpen(false)
        setConfirmRidePanel(false)
        
        // Open vehicle panel - this will stay open until user closes it or confirms ride
        setVehiclePanel(true)

        try {
            const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
            const response = await axios.get(`${baseURL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data || {})
        } catch (err) {
            console.error('Error fetching fare:', err)
            // Keep panel open even on error - user can see the issue and try again
        }
    }

    async function createRide() {
        try {
            const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
            await axios.post(`${baseURL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        } catch (err) {
            console.error('Error creating ride:', err)
        }
    }

    return (
        <div className='h-screen relative overflow-hidden bg-gray-50'>
            {/* Uber Logo */}
            <div className='absolute left-5 top-5 z-20'>
                <img className='w-20 h-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
            </div>
            
            {/* Map Container - shrink height so it's clearly visible behind the panel */}
            <div className='w-screen h-[55vh] pt-16'>
                <LiveTracking />
            </div>
            
            {/* Bottom Panel Container - Fixed to stay below logo */}
            <div className='absolute bottom-0 w-full pointer-events-none' style={{ top: '80px' }}>
                <div className='flex flex-col justify-end h-full'>
                    {/* Main Input Panel */}
                    <div className='bg-white rounded-t-3xl shadow-2xl relative pointer-events-auto' style={{ minHeight: '280px' }}>
                    <div className='p-6 pb-4'>
                        {/* Close Button */}
                        <button 
                            ref={panelCloseRef} 
                            onClick={() => {
                                setPanelOpen(false)
                                setActiveField(null)
                            }} 
                            className='absolute opacity-0 right-6 top-6 text-2xl text-gray-400 hover:text-black transition-colors'
                        >
                            <i className="ri-close-line"></i>
                        </button>
                        
                        <h4 className='text-2xl font-semibold mb-6 text-gray-900'>Where to?</h4>
                        
                        <form className='relative' onSubmit={submitHandler}>
                            {/* Vertical Line */}
                            <div className="absolute h-20 w-0.5 top-1/2 -translate-y-1/2 left-6 bg-gray-300 rounded-full z-10"></div>
                            
                            {/* Pickup Input */}
                            <div className='relative mb-3'>
                                <div className='absolute left-4 top-1/2 -translate-y-1/2 z-20'>
                                    <div className='w-3 h-3 rounded-full bg-black border-2 border-white'></div>
                                </div>
                                <input
                                    onClick={() => {
                                        setPanelOpen(true)
                                        setActiveField('pickup')
                                    }}
                                    value={pickup}
                                    onChange={handlePickupChange}
                                    className='bg-gray-100 hover:bg-gray-200 focus:bg-white px-12 py-4 text-base rounded-lg w-full border-2 border-transparent focus:border-black transition-all outline-none'
                                    type="text"
                                    placeholder='Enter pickup location'
                                />
                            </div>
                            
                            {/* Destination Input */}
                            <div className='relative'>
                                <div className='absolute left-4 top-1/2 -translate-y-1/2 z-20'>
                                    <i className="ri-map-pin-line text-xl text-gray-400"></i>
                                </div>
                                <input
                                    onClick={() => {
                                        setPanelOpen(true)
                                        setActiveField('destination')
                                    }}
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    className='bg-gray-100 hover:bg-gray-200 focus:bg-white px-12 py-4 text-base rounded-lg w-full border-2 border-transparent focus:border-black transition-all outline-none'
                                    type="text"
                                    placeholder='Where to?' 
                                />
                            </div>
                        </form>
                        
                        {/* Find Trip Button */}
                        <button
                            onClick={findTrip}
                            disabled={!pickup.trim() || !destination.trim()}
                            className='bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-4 py-4 rounded-lg mt-6 w-full text-base transition-colors'
                        >
                            Find Trip
                        </button>
                    </div>
                </div>
                
                    {/* Suggestions Panel - Limited height to prevent overlap */}
                    <div ref={panelRef} className='bg-white h-0 overflow-hidden pointer-events-auto transition-all'>
                        <div className='px-6 pb-6 overflow-y-auto'>
                            <LocationSearchPanel
                                suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                setPanelOpen={setPanelOpen}
                                setVehiclePanel={setVehiclePanel}
                                setPickup={setPickup}
                                setDestination={setDestination}
                                activeField={activeField}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Vehicle Selection Panel - fixed height with internal scroll */}
            <div ref={vehiclePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-6 py-6 h-[65vh] overflow-y-auto'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel} 
                />
            </div>
            
            {/* Confirm Ride Panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-6 py-6 max-h-[85vh] overflow-y-auto'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound}
                    setVehiclePanel={setVehiclePanel}
                />
            </div>
            
            {/* Looking For Driver Panel */}
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-6 py-6 max-h-[85vh] overflow-y-auto'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} 
                />
            </div>
            
            {/* Waiting For Driver Panel */}
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white rounded-t-3xl shadow-2xl px-6 py-6 max-h-[85vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} 
                />
            </div>
        </div>
    )
}

export default Home
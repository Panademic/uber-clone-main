import React from 'react'

const LocationSearchPanel = ({ suggestions = [], setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        setPanelOpen(false)
    }

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className='py-8 text-center'>
                <i className="ri-map-pin-line text-4xl text-gray-300 mb-3"></i>
                <p className='text-gray-400 text-sm'>Start typing to see suggestions</p>
            </div>
        )
    }

    return (
        <div className='py-2'>
            <h3 className='text-sm font-semibold text-gray-500 mb-3 px-2'>Suggestions</h3>
            {suggestions.map((elem, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleSuggestionClick(elem)} 
                    className='flex gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 rounded-lg items-center cursor-pointer transition-colors border-b border-gray-100 last:border-0'
                >
                    <div className='bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full flex-shrink-0'>
                        <i className="ri-map-pin-line text-gray-600"></i>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h4 className='font-medium text-gray-900 text-base truncate'>{elem}</h4>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel
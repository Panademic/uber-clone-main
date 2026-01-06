
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)

    if (!captain) {
        return (
            <div className='text-center py-8'>
                <p className='text-gray-500'>Loading captain details...</p>
            </div>
        )
    }

    const captainName = captain.fullname 
        ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim() 
        : 'Captain'

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-200' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain" />
                    <div>
                        <h4 className='text-lg font-semibold capitalize text-gray-900'>{captainName}</h4>
                        <p className='text-sm text-gray-500'>Online</p>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-xl font-semibold text-gray-900'>₹295.20</h4>
                    <p className='text-sm text-gray-600'>Earned Today</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails
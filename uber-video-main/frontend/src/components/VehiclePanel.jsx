import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div className='pb-6'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4'>
                <div 
                    onClick={() => props.setVehiclePanel(false)} 
                    className='w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors'
                ></div>
            </div>
            
            <h3 className='text-2xl font-semibold mb-6 text-gray-900'>Choose a ride</h3>
            
            {/* UberGo */}
            <div 
                onClick={() => {
                    props.selectVehicle('car')
                    props.setConfirmRidePanel(true)
                    // Keep vehicle panel open so user can change selection
                }} 
                className='flex border-2 border-gray-200 hover:border-black mb-3 rounded-xl w-full p-4 items-center justify-between cursor-pointer transition-all hover:shadow-md'
            >
                <img className='h-12 w-12 object-contain' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="UberGo" />
                <div className='ml-3 flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold text-base text-gray-900'>UberGo</h4>
                        <span className='text-gray-500 text-sm'><i className="ri-user-3-fill"></i> 4</span>
                    </div>
                    <h5 className='font-medium text-sm text-gray-600 mb-1'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable, compact rides</p>
                </div>
                <h2 className='text-xl font-semibold text-gray-900 ml-4'>₹{props.fare?.car || '--'}</h2>
            </div>
            
            {/* Moto */}
            <div 
                onClick={() => {
                    props.selectVehicle('moto')
                    props.setConfirmRidePanel(true)
                    // Keep vehicle panel open so user can change selection
                }} 
                className='flex border-2 border-gray-200 hover:border-black mb-3 rounded-xl w-full p-4 items-center justify-between cursor-pointer transition-all hover:shadow-md'
            >
                <img className='h-12 w-12 object-contain' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                <div className='ml-3 flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold text-base text-gray-900'>Moto</h4>
                        <span className='text-gray-500 text-sm'><i className="ri-user-3-fill"></i> 1</span>
                    </div>
                    <h5 className='font-medium text-sm text-gray-600 mb-1'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable motorcycle rides</p>
                </div>
                <h2 className='text-xl font-semibold text-gray-900 ml-4'>₹{props.fare?.moto || '--'}</h2>
            </div>
            
            {/* UberAuto */}
            <div 
                onClick={() => {
                    props.selectVehicle('auto')
                    props.setConfirmRidePanel(true)
                    // Keep vehicle panel open so user can change selection
                }} 
                className='flex border-2 border-gray-200 hover:border-black mb-3 rounded-xl w-full p-4 items-center justify-between cursor-pointer transition-all hover:shadow-md'
            >
                <img className='h-12 w-12 object-contain' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="UberAuto" />
                <div className='ml-3 flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold text-base text-gray-900'>UberAuto</h4>
                        <span className='text-gray-500 text-sm'><i className="ri-user-3-fill"></i> 3</span>
                    </div>
                    <h5 className='font-medium text-sm text-gray-600 mb-1'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable Auto rides</p>
                </div>
                <h2 className='text-xl font-semibold text-gray-900 ml-4'>₹{props.fare?.auto || '--'}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel
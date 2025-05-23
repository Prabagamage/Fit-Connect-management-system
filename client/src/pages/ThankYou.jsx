import React from 'react'
import TopNav from '../components/TopNav'
import imageB from '../assets/image6.png'
import tick from '../assets/greentick.jpg'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ThankYou = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const homeUrl = searchParams.get('home')
    return (
        <div>
            <TopNav />

            <button className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10'>Add Question</button>

            <div style={{ backgroundImage: `url(${imageB})` }} className='bg-cover min-h-[80vh] p-10 w-full mt-10'>
                <div className='text-center w-3/4 md:w-1/2 mx-auto p-10 bg-white'>
                    <img src={tick} alt="tick" className='mt-10 w-1/2 mx-auto' />

                    <h2>Thank You</h2>
                    <p>Your question has been added successfully</p>
                    <button className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 cursor-pointer' onClick={() => navigate(-1)}>Go Back</button>
                    {homeUrl && <button className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 cursor-pointer block mx-auto' onClick={() => navigate(homeUrl)}>Go Home</button>}
                </div>
            </div>
        </div>
    )
}

export default ThankYou
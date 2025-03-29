import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
    const navigate = useNavigate();
    return (
        <div
            className="flex flex-col h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_a_dumbbell_lunge_in_the_gym.jpg')" }}
        >

            {/* Top Header */}
            <div className="mt-10">
                <p className="text-3xl font-bold text-center text-white">ADD CHALLENGE</p>
            </div>

            {/* Centered Content */}
            <div className="flex flex-col flex-grow items-center justify-center h-screen">
                <div className='p-10 bg-white rounded-3xl flex flex-col gap-10 items-center'>
                    <p className='text-center text-2xl font-bold'>You saved Challenge details Successfully</p>
                    <img className='w-60' src='https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png' />
                </div>
                <div className="mt-10">
                    <button
                        type="button"
                        className="bg-[#815B5B] text-white py-3 px-6 rounded-lg cursor-pointer"
                        onClick={() => navigate('/challenges')}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import AuthAxios from '../../utils/AuthAxios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeleteChallenge() {
    const navigate = useNavigate();
    const { id } = useParams();  // Getting the challenge ID from URL params

    const handleDelete = () => {
        // Make DELETE request to the API directly when "Yes" is clicked
        AuthAxios.delete(`/api/challenges/${id}`)
            .then(() => {
                // On successful deletion, navigate back to challenges page
                navigate('/challenges');
            })
            .catch(error => {
                console.error("Error deleting challenge:", error);
                alert("Failed to delete challenge.");
            });
    };

    return (
        <div
            className="flex flex-col h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_a_dumbbell_lunge_in_the_gym.jpg')" }}
        >

            {/* Top Header */}
            <div className="mt-10">
                <p className="text-3xl font-bold text-center text-white">Delete CHALLENGE</p>
            </div>

            {/* Centered Content */}
            <div className="flex flex-col flex-grow items-center justify-center h-screen">
                <div className='p-10 bg-white rounded-3xl flex flex-col gap-10 items-center'>
                    <p className='text-center text-2xl font-bold'>Do you really want to delete the Challenge?</p>
                    <img className='w-60' src='https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png' />
                    <div className='flex justify-between w-[300px]'>
                        <button
                            type="button"
                            className="bg-green-500 text-white py-3 px-6 rounded-lg cursor-pointer"
                            onClick={() => navigate('/challenges')}  // Navigate back without deleting
                        >
                            No
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white py-3 px-6 rounded-lg cursor-pointer"
                            onClick={handleDelete}  // Trigger the delete function directly
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

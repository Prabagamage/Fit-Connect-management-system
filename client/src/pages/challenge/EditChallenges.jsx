import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAxios from '../../utils/AuthAxios';
import TopNav from '../../components/TopNav';

export default function EditChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const navigate = useNavigate();
  
    const handleEditClick = (challengeId) => {
      // Immediately navigate to edit page
      navigate(`/edit-challenge/${challengeId}`);
    };
  
    const handleDeleteClick = (challengeId) => {
      // Immediately navigate to delete page
      navigate(`/delete-challenge/${challengeId}`);
    };

    const handleNavigate = (route) => {
      // Use arrow function to ensure immediate navigation
      () => navigate(route);
    };

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await AuthAxios.get("/api/challenges");
                setChallenges(response.data);
                setFilteredChallenges(response.data);
            } catch (error) {
                console.error("Error fetching challenges:", error);
                // Optional: Add error handling toast or notification
            }
        };

        fetchChallenges();
    }, []);

    useEffect(() => {
        const filtered = challenges.filter(challenge =>
            challenge.challengeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            challenge.challengeCategory.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredChallenges(filtered);
    }, [searchQuery, challenges]);

    return (
        <>
        <TopNav />
        <div className='flex flex-row w-full h-screen'>
            {/* Left Sidebar (Fixed) */}
            <div className='flex flex-col w-1/5 h-full'>
                <div className='w-full bg-gray-300 p-10'>
                    <p className='text-2xl font-bold'>Challenge Listing</p>
                </div>
                <div className='w-full bg-gray-500 p-10 space-y-4 flex-1'>
                    <p className='text-2xl font-bold p-4 bg-white'>Gym List</p>
                    <p 
                        className='text-2xl font-bold p-4 bg-white cursor-pointer'
                        onClick={() => navigate('/create-challenge')}
                    >
                        Create Challenge
                    </p>
                    <p 
                        className='text-2xl font-bold p-4 bg-white cursor-pointer'
                        onClick={() => navigate('/edit-challenges')}
                    >
                        Edit Challenge
                    </p>
                    <p 
                        className='text-2xl font-bold p-4 bg-white cursor-pointer'
                        onClick={() => navigate('/challenges')}
                    >
                        Challenge Category
                    </p>
                    <p className='text-2xl font-bold p-4 bg-white'>Reviews</p>
                </div>
            </div>

            {/* Rest of the component remains the same */}
            {/* Right Content (Scrollable) */}
            <div className='flex flex-col w-full h-full overflow-hidden'>
                {/* Top Header */}
                <div className='flex justify-between items-center w-full border-b border-gray-300 p-5 bg-white'>
                    <p className='text-2xl font-bold'>YOUR CHALLENGE</p>
                    <input
                        type='text'
                        className='bg-gray-300 p-4 rounded-md'
                        placeholder='Search challenges'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Scrollable Challenge List */}
                <div className='grid grid-cols-2 gap-5 p-10 h-full overflow-scroll'>
                    {filteredChallenges.map((challenge, index) => (
                        <div
                            key={index}
                            className='relative w-[520px] h-max bg-cover bg-center rounded-lg p-5 gap-5 flex items-center flex-col text-white shadow-lg'
                        >
                            <img
                                className='w-full h-70 object-cover rounded-lg'
                                src={`http://localhost:5001${challenge.challengeImage}`} 
                                alt="Challenge"
                            />
                            <div className='p-4 text-center text-black'>
                                <h2 className='text-2xl font-bold'>{challenge.challengeName}</h2>
                                <p className='text-lg'>{challenge.gymName}</p>
                                <p className='text-sm'>{challenge.challengeCategory}</p>
                            </div>
                            <div className='flex justify-between gap-2 w-full'>
                                <button
                                    type="button"
                                    className="bg-green-500 text-white py-3 px-6 rounded-lg cursor-pointer"
                                    onClick={() => handleEditClick(challenge._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white py-3 px-6 rounded-lg cursor-pointer"
                                    onClick={() => handleDeleteClick(challenge._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
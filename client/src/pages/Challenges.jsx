import React, { useEffect, useState } from 'react';
import AuthAxios from '../utils/AuthAxios';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const navigate = useNavigate();
  
    const handleChallengeClick = (challengeId) => {
      navigate(`/do-challenge/${challengeId}`);
    };

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await AuthAxios.get("/api/challenges");
                setChallenges(response.data);
                setFilteredChallenges(response.data);
            } catch (error) {
                console.error("Error fetching challenges:", error);
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
        <TopNav/>
        <div className='flex lg:flex-row flex-col w-full h-screen'>
            {/* Left Sidebar (Fixed) */}
            <div className='flex flex-row lg:flex-col w-full lg:w-1/5 lg:h-full'>
                <div className='w-full bg-gray-300 p-10'>
                    <p className='text-2xl font-bold'>Challenge Listing</p>
                </div>
                <div className='w-full flex lg:flex-col flex-row bg-gray-500 p-10 space-y-4 flex-1'>
                    <p className='text-2xl font-bold p-4 bg-white cursor-pointer' onClick={() => navigate('/gym-list')}>Gym List</p>
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
                    <p onClick={() => navigate('/review-add')} className='text-2xl cursor-pointer font-bold p-4 bg-white'>Reviews</p>
                </div>
            </div>

            {/* Rest of the component remains the same */}
            {/* Right Content (Scrollable) */}
            <div className='flex flex-col w-full h-full overflow-hidden'>
                {/* Top Header */}
                <div className='flex justify-between items-center w-full border-b border-gray-300 p-5 bg-white'>
                    <p className='text-2xl font-bold'>ALL CHALLENGE</p>
                    <input
                        type='text'
                        className='bg-gray-300 p-4 rounded-md'
                        placeholder='Search challenges'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Scrollable Challenge List */}
                <div className='grid md:grid-cols-1 xl:grid-cols-2 gap-5 p-10 h-full overflow-scroll'>
                    {filteredChallenges.map((challenge, index) => (
                        <div
                            key={index}
                            onClick={() => handleChallengeClick(challenge._id)}
                            className='relative w-[520px] cursor-pointer hover:border-black border border-white h-max bg-cover bg-center rounded-lg p-5 gap-5 flex items-center flex-col text-white shadow-lg'
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
}
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
        <TopNav />
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Left Sidebar */}
        <div className="w-1/5 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-teal-200">Gym Hub</h2>
          <nav className="space-y-4">
            
            <button
              className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-teal-100"
              onClick={() => navigate('/create-challenge')}
            >
              🏋️‍♂️ Create Challenge
            </button>
            <button
              className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-teal-100"
              onClick={() => navigate('/edit-challenges')}
            >
              🏋️‍♂️ Edit Challenge
            </button>
            
            <button
              className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-teal-100"
              onClick={() => navigate('/Faq')}
            >
              🏋️‍♂️Q&A
            </button>
          </nav>
        </div>
            {/* Rest of the component remains the same */}
            {/* Right Content (Scrollable) */}
            <div className='flex flex-col w-full h-full overflow-hidden'>
                {/* Top Header */}
                <div className='flex justify-between items-center w-full border-b border-gray-300 p-5 bg-gradient'>
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
                <div className='grid md:grid-cols-1 xl:grid-cols-2 gap-5 bg-gradient-to-b from-gray-400 to-gray-500 p-10 h-full overflow-scroll'>
                    {filteredChallenges.map((challenge, index) => (
                        <div
                            key={index}
                            onClick={() => handleChallengeClick(challenge._id)}
                            className='relative w-[520px] cursor-pointer hover:border-black border border-white bg-gray-200 h-max bg-cover bg-center rounded-lg p-5 gap-5 flex items-center flex-col text-white shadow-lg'
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
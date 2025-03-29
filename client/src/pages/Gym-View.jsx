import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import TopNav from '../components/TopNav';
import AuthAxios, { BASE_URL } from '../utils/AuthAxios';

const GymView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await AuthAxios.get(`/api/gyms/${id}`);
        console.log(response.data);
        setGym(response.data);
      } catch (error) {
        console.error('Error fetching gym:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (!gym) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Gym not found!</div>;
  }

  return (
    <>
      <TopNav />
      <div className='flex flex-row w-full h-screen'>
      {/* Left Sidebar (Fixed) */}
      <div className='flex flex-col w-1/5 h-full'>
                <div className='w-full bg-gray-300 p-10'>
                    <p className='text-3xl font-bold'>Gym List</p>
                </div>
                <div className='w-full bg-gray-400 p-10 space-y-4 flex-1'>
                    <p className='text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer'
                    onClick={() => navigate('/gym-list')}>Gym List</p>
                    <p className='text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer'
                    onClick={() => navigate('/review-add')}>Reviews</p>
                </div>
            </div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <button
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-4">{gym.name}</h2>
        <p className="text-lg text-gray-600 text-center mb-6">{gym.location}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{
            gym?.images?.map((image, index) => (
              <img
                key={index}
                src={BASE_URL + image || "https://via.placeholder.com/400"}
                alt={gym.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))
          }
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-2">Ratings:</h3>
            <div className="text-yellow-500 text-2xl">{'★'.repeat(Math.floor(gym.ratings)) + '☆'.repeat(5 - Math.floor(gym.ratings))}</div>
            <p className="mt-4 text-gray-700">{gym.description || "No description available."}</p>
          </div>
        </div>

        {gym.reviews?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
            <ul className="space-y-2">
              {gym.reviews.map((review, index) => (
                <li key={index} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default GymView;
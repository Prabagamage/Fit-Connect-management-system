import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      <div className='flex flex-row w-full h-screen bg-gray-300 overflow-auto'>
        {/* Left Sidebar (Fixed) */}
        <div className='flex flex-col w-1/5 h-full'>
          <div className='w-full bg-gray-500 p-10'>
            <p className='text-3xl font-bold'>Gym List</p>
          </div>
          <div className='w-full bg-gray-400 p-10 space-y-4 flex-1'>
          <p
  className="text-xl font-semibold px-6 py-3 bg-gray-200 hover:bg-gray-300 hover:text-black rounded-lg shadow-sm transition cursor-pointer"
  onClick={() => navigate('/gym-list')}
>
  🏋️‍♀️ Gym List
</p>
<p
  className="text-xl font-semibold px-6 py-3 bg-gray-200 hover:bg-gray-300 hover:text-black rounded-lg shadow-sm transition cursor-pointer"
  onClick={() => navigate('/review-add')}
>
  💬 Reviews
</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg mt-10 mx-auto max-w-4xl">
          <button
            className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h3 className="text-3xl font-bold text-center mb-4">{gym.name}</h3>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              {gym?.images?.length > 0 ? (
                gym.images.map((image, index) => (
                  <img
                    key={index}
                    src={BASE_URL + image}
                    alt={`Gym Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                  />
                ))
              ) : (
                <img
                  src="https://via.placeholder.com/400"
                  alt="Placeholder"
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                />
              )}
            </div>

            {/* Gym Details */}
            <div className="flex flex-col justify-center space-y-2">
              <p><strong>Location:</strong> {gym.location}</p>
              <p><strong>Phone:</strong> {gym.phone}</p>
              <p><strong>Email:</strong> {gym.email}</p>
              <p><strong>Fees:</strong> ${gym.fees}</p>
              <p><strong>Ratings:</strong> 
                <span className="text-yellow-500 text-xl ml-2">
                  {'★'.repeat(Math.floor(gym.ratings)) + '☆'.repeat(5 - Math.floor(gym.ratings))}
                </span>
              </p>
              {gym.services?.length > 0 && (
                <div>
                  <p className="font-semibold mt-2">Services:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {gym.services.map((service, idx) => (
                      <li key={idx}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
       
            </div>
          </div>

          {/* Reviews */}
          {gym.reviews?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Reviews:</h3>
              <ul className="space-y-2">
                {gym.reviews.map((review, index) => (
                  <li key={index} className="p-3 border rounded-lg shadow-xl">

                   <p className="font-bold text-blue-900">{review.user}</p>
                   
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

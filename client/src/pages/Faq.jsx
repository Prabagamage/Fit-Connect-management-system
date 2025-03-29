import React from 'react';
import TopNav from '../components/TopNav';
import imageB from '../assets/image 84.png';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
    const navigate = useNavigate();
  
    return (
        <div className="min-h-screen bg-gray-100">
            <TopNav />
            
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                <button className="bg-gray-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition duration-300">
                    FAQ Page
                </button>
                
                <p className="text-xl font-semibold mt-6 text-gray-700 text-center">
                    Welcome to Our Gym's FAQ Page!
                </p>
                
                <div className="flex justify-center mt-6">
                    <img src={imageB} alt="Gym FAQ" className="rounded-lg shadow-md max-w-full h-auto" />
                </div>
                
                <h2 className="text-2xl font-semibold mt-10 text-gray-800 text-center">
                    Introduction
                </h2>
                
                <p className="text-lg text-gray-600 mt-6 text-center">
                    We know you might have some questions before starting your fitness journey with us. 
                    Here, you'll find answers to the most common inquiries about memberships, 
                    facilities, classes, personal training, and more.
                </p>
                
                <div className="flex justify-center mt-8">
                    <button onClick={() => navigate('/commonfaq')} 
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition duration-300">
                        See More
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Faq;
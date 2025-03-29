import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { useNavigate } from 'react-router-dom';
import AuthAxios from '../utils/AuthAxios';

const sampleQ = [
    {
        title: "What are your gym’s operating hours?",
        description: "Our gym is open during the week from around 6:00 AM to 10:00 PM."
    },
    {
        title: "Do I need a membership to use the gym?",
        description: "Yes, a membership is required, but we also offer day passes."
    },
    {
        title: "Do you have locker rooms and showers?",
        description: "Yes, we provide locker rooms, showers, and changing areas."
    }
];

const CommonFaq = () => {
    const [faqs, setFaqs] = useState(sampleQ);
    const [allFaqs, setAllFaqs] = useState([]);
    const navigate = useNavigate();

    const getAllFaqs = async () => {
        try {
            const rep = await AuthAxios.get("/discussion/all");
            setAllFaqs(rep.data?.data?.discussions);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllFaqs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <TopNav />

            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Common Questions</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-200 p-4 rounded-xl shadow-md mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Q: {faq.title}</h3>
                        <p className="text-gray-700 mt-2">A: {faq.description}</p>
                    </div>
                ))}

                <h2 className="text-2xl font-semibold text-center text-gray-800 mt-10 mb-6">New Questions</h2>
                {allFaqs.map((faq, index) => (
                    <div key={index} className="bg-gray-300 p-4 rounded-xl shadow-md mb-4 relative">
                        <h3 className="text-lg font-semibold text-gray-800">Q: {faq.title}</h3>
                        <p className="text-gray-700 mt-2">A: {faq.description}</p>
                        <button 
                            className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-600 transition duration-300 absolute right-5 top-5"
                            onClick={() => navigate(`/faq/${faq._id}?answer=true`)}
                        >
                            Answer
                        </button>
                    </div>
                ))}

                <div className="flex justify-between mt-6">
                    <button 
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition duration-300"
                        onClick={() => navigate("/myfaq")}
                    >
                        My Questions
                    </button>
                    <button 
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition duration-300"
                        onClick={() => navigate("/askfaq")}
                    >
                        Ask a Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommonFaq;
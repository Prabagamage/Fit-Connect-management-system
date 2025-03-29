import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import myQimage from '../assets/my.png';
import AuthAxios from '../utils/AuthAxios';
import { useNavigate } from 'react-router-dom';

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

const MyFaq = () => {
    const [myq, setMyq] = useState(sampleQ);
    const navigate = useNavigate();

    const getMyq = async () => {
        try {
            const rep = await AuthAxios.get("/discussion/");
            console.log(rep);
            setMyq(rep.data?.data?.discussions);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMyq();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <TopNav />

            <div className="max-w-4xl mx-auto p-6">
                <button className="bg-gray-500 text-white px-6 py-3 rounded-2xl mt-6 w-full md:w-auto text-center font-semibold">My Questions</button>

                <img src={myQimage} alt="Submitted Questions" className="mt-10 w-full rounded-lg shadow-md" />

                <div className="text-center w-full md:w-3/4 mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                    <h2 className="text-2xl font-bold mb-6">Submitted Questions</h2>

                    {myq.length > 0 ? (
                        myq.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row bg-gray-200 justify-between py-3 items-center my-4 rounded-lg p-4 shadow-md">
                                <h3 className="text-lg font-semibold text-left w-full md:w-auto">Q: {item.title}</h3>
                                <button onClick={() => navigate(`/faq/${item._id}`)} className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all">View</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No questions submitted yet.</p>
                    )}
                </div>

                <div className="flex justify-center mt-10">
                    <button className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-600 transition-all" onClick={() => navigate("/commonfaq")}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default MyFaq;
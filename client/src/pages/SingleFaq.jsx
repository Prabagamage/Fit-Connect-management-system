import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { useNavigate, useParams } from 'react-router-dom';
import AuthAxios from '../utils/AuthAxios';

const SingleFaq = () => {
    const navigate = useNavigate();
    const params = useParams();
    const searchParams = new URLSearchParams(window.location.search);
    const isAnswer = searchParams.get("answer");
    const [isEditing, setIsEditing] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [q, setQ] = useState({
        title: "What are your gym’s operating hours?",
        description: "Our gym is open during the week from around 6:00 AM to 10:00 PM."
    });

    const handleChange = (e) => {
        setQ({
            ...q,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = async () => {
        try {
            const rep = await AuthAxios.delete(`/discussion/${q._id}`);
            console.log(rep);
            alert("Question Deleted Successfully");
            navigate("/myfaq");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async () => {
        try {
            if (!isEditing && !isAnswer) {
                setIsEditing(true);
                return;
            }
            const rep = await AuthAxios.patch(`/discussion/${q._id}`, {
                title: q.title,
                description: q.description
            });
            console.log(rep);
            setIsEditing(false);
            setRefresh(!refresh);
            alert("Question Updated Successfully");
        } catch (error) {
            console.log(error);
            setIsEditing(false);
        }
    };

    const getMyq = async () => {
        try {
            const rep = await AuthAxios.get(`/discussion/${params.id}`);
            console.log(rep);
            setQ(rep.data?.data?.discussion);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMyq();
    }, [refresh]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <TopNav />

            <div className="max-w-4xl mx-auto p-6">
                <button className="bg-gray-500 text-white px-6 py-3 rounded-2xl mt-6 w-full md:w-auto text-center font-semibold">View Question</button>

                <div className="w-full md:w-3/4 mx-auto px-4 py-8 bg-white shadow-lg rounded-lg mt-10">
                    <h5 className="text-lg font-semibold mb-4">Submitted Question:</h5>
                    <input disabled={!isEditing} name='title' className='text-xl bg-gray-200 p-3 font-semibold w-full rounded-lg' onChange={handleChange} value={q.title}></input>
                    <h5 className='text-lg font-semibold mt-5'>Answer:</h5>
                    <input disabled={isAnswer ? false : !isEditing} name='description' className='text-lg font-semibold mt-3 bg-gray-200 p-3 w-full rounded-lg' onChange={handleChange} value={q.description}></input>
                </div>

                <div className="flex justify-center gap-4 mt-10">
                    <button className='bg-gray-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-600 transition-all' onClick={handleSave}>{(isEditing || isAnswer) ? "Save" : "Edit"}</button>
                    <button className='bg-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-600 transition-all' onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default SingleFaq;
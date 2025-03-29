import React, { useState } from 'react'
import AuthAxios from '../utils/AuthAxios'
import { useNavigate } from 'react-router-dom'

const AskFaQ = () => {
    const navigate = useNavigate()
    const [faq, setFaq] = useState({
        name: "",
        mobile: "",
        email: "",
        question: ""
    })

    const handleChange = (e) => {
        setFaq({
            ...faq,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        try {
            const resp = await AuthAxios.post("/discussion/create", {
                gym: '',
                title: faq.question,
                description: 'Not answered yet',
                name: faq.name,
                email: faq.email,
                mobile: faq.mobile
            });

            console.log(resp);
            navigate("/thank")
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Something went wrong")
        }
    }
    return (
        <div>
            <button className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10'>Ask a Question</button>
            <p className='text-lg font-semibold mt-10 ml-10'>Enter your questions , and our team will answered you shortlyl.</p>

            {/* name mobile email question */}
            <div className='bg-gray-500 flex flex-col p-5'>
                <input type="text" onChange={handleChange} name='name' value={faq.name} placeholder='Enter Name :' className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10' />
                <input type="text" onChange={handleChange} name='mobile' value={faq.mobile} placeholder='Enter Mobile Number :' className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10' />
                <input type="text" onChange={handleChange} name='email' value={faq.email} placeholder='Email Address :' className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10' />
                <textarea onChange={handleChange} name='question' value={faq.question} placeholder='Enter Your Question :' className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10' cols={30} rows={10}></textarea>
            </div>
            {/* Submit cancel buttons */}
            <div className='flex items-center justify-center gap-5'>
                <button className='bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all cursor-pointer mt-10 mb-5' onClick={handleSubmit}>Submit</button>
                <button className='bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all cursor-pointer mt-10 mb-5' onClick={()=>navigate("/commonfaq")}>Cancel</button>
            </div>
        </div>
    )
}

export default AskFaQ
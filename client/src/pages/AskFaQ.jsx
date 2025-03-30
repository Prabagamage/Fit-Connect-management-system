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
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFaq({
            ...faq,
            [name]: value
        })
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        // Name validation
        if (!faq.name.trim()) {
            newErrors.name = "Name is required"
        }
        
        // Mobile validation - basic format for phone numbers
        if (!faq.mobile.trim()) {
            newErrors.mobile = "Mobile number is required"
        } else if (!/^\d{10}$/.test(faq.mobile.trim())) {
            newErrors.mobile = "Please enter a valid 10-digit mobile number"
        }
        
        // Email validation
        if (!faq.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(faq.email.trim())) {
            newErrors.email = "Please enter a valid email address"
        }
        
        // Question validation
        if (!faq.question.trim()) {
            newErrors.question = "Question is required"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }
        
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
            <p className='text-lg font-semibold mt-10 ml-10'>Enter your questions, and our team will answer you shortly.</p>
            
            <div className='bg-gray-500 flex flex-col p-5'>
                <div className="relative mb-2">
                    <input 
                        type="text" 
                        onChange={handleChange} 
                        name='name' 
                        value={faq.name} 
                        placeholder='Enter Name *' 
                        className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 w-11/12' 
                        required
                    />
                    {errors.name && <p className="text-white ml-10 mt-1">{errors.name}</p>}
                </div>
                
                <div className="relative mb-2">
                    <input 
                        type="tel" 
                        onChange={handleChange} 
                        name='mobile' 
                        value={faq.mobile} 
                        placeholder='Enter Mobile Number *' 
                        className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 w-11/12' 
                        required
                    />
                    {errors.mobile && <p className="text-white ml-10 mt-1">{errors.mobile}</p>}
                </div>
                
                <div className="relative mb-2">
                    <input 
                        type="email" 
                        onChange={handleChange} 
                        name='email' 
                        value={faq.email} 
                        placeholder='Email Address *' 
                        className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 w-11/12' 
                        required
                    />
                    {errors.email && <p className="text-white ml-10 mt-1">{errors.email}</p>}
                </div>
                
                <div className="relative mb-2">
                    <textarea 
                        onChange={handleChange} 
                        name='question' 
                        value={faq.question} 
                        placeholder='Enter Your Question *' 
                        className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 w-11/12' 
                        cols={30} 
                        rows={10}
                        required
                    ></textarea>
                    {errors.question && <p className="text-white ml-10 mt-1">{errors.question}</p>}
                </div>
            </div>
            
            <div className='flex items-center justify-center gap-5'>
                <button 
                    className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 hover:bg-gray-300'
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button 
                    className='bg-gray-200 px-4 py-3 rounded-2xl mt-10 ml-10 hover:bg-gray-300'
                    onClick={() => navigate("/commonfaq")}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default AskFaQ
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ className }) => {
    const navigate = useNavigate()
    return (
        <button className={`bg-gray-200 px-4 cursor-pointer py-3 rounded-2xl mt-10 ml-10 ${className}`} onClick={() => navigate(-1)}><FaArrowLeft/></button>
    )
}

export default BackButton
import React from 'react'
import logo from '../assets/FitConnect.png'
import { useNavigate } from 'react-router-dom'

const navItems = [

    {
        name: "Challenges",
        link: "/challenges"
    },
    {
        name: "Gyms",
        link: "/gym-list"
    },
    {
        name: "Q&A",
        link: "/faq"
    },
]
const TopNav = () => {
    const isLoggedIn = localStorage.getItem("auth_token")
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth_token")
        navigate("/")
    }
    return (
        <div className='bg-black p-3 flex items-center justify-between'>
            <div className='w-32'>
                <img src={logo} alt="logo" />
            </div>
            <div className='float-end flex w-max'>

                {
                    navItems.map((item, index) => {
                        return (
                            <div className='text-white px-3' key={index}>
                                <a href={item.link}>{item.name}</a>
                            </div>
                        )
                    })
                }

                {
                    isLoggedIn && <div className='text-white px-3'>
                        <button className='text-white' onClick={handleLogout} >Logout</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default TopNav
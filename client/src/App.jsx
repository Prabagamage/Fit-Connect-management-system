import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Overview from './pages/Overview'
import Community from './pages/Community'
import Faq from './pages/Faq'
import CommonFaq from './pages/CommonFaq'
import AskFaQ from './pages/AskFaQ'
import MyFaq from './pages/MyFaq'
import ThankYou from './pages/ThankYou'
import SingleFaq from './pages/SingleFaq'
import GymList from './pages/Gym-List'
import GymAddNew from './pages/Gym-Add-New'
import GymView from './pages/Gym-View'
import GymUpdate from './pages/Gym-Update'
import CreateChallenge from './pages/challenge/CreateChallenge'
import Success from './pages/challenge/Success'
import EditChallenge from './pages/challenge/EditChallenge'
import DeleteChallenge from './pages/challenge/Delete'
import { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/dark.css';
import Challenges from './pages/Challenges'
import EditChallenges from './pages/challenge/EditChallenges'
import ViewChallenge from './pages/challenge/ViewChallenge'
import SuccessPage from './pages/common/SuccessPage'
import AddReview from './pages/AddReview'
import Register from './pages/Register'
import Login from './pages/Login'



function App() {
  toastConfig({ theme: 'dark' });
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/community" element={<Community />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/commonfaq" element={<CommonFaq />} />
          <Route path="/askfaq" element={<AskFaQ />} />
          <Route path="/myfaq" element={<MyFaq />} />
          <Route path="/thank" element={<ThankYou />} />
          <Route path="/faq/:id" element={<SingleFaq />} />


          <Route path="/gym-list" element={<GymList />} />
          <Route path="/gym-add-new" element={<GymAddNew />} />
          <Route path="/gym-view/:id" element={<GymView />} />
          <Route path="/gym-update/:id" element={<GymUpdate />} />
          
          <Route path="/review-add" element={<AddReview />} />


          <Route path="/create-challenge" element={<CreateChallenge />} />
          <Route path="/success" element={<Success />} />
          <Route path="/edit-challenges" element={<EditChallenges />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/do-challenge/:id" element={<ViewChallenge />} />
          <Route path="/edit-challenge/:id" element={<EditChallenge />} />
          <Route path="/delete-challenge/:id" element={<DeleteChallenge />} />


          <Route path="/success-page" element={<SuccessPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>


  )
}

export default App

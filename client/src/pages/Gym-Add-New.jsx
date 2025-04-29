import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAxios from '../utils/AuthAxios';
import TopNav from '../components/TopNav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GymAddNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gymName: "",
    location: "",
    phone: "",
    email: "",
    fees: "",
    services: {
      strengthTraining: false,
      cardioMachines: false,
      freeWeights: false,
      personalTraining: false,
      groupFitness: false,
      lockerRooms: false,
      parking: false,
    },
    photos: [],
  });

  const handleCheckboxChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: { ...prev.services, [service]: !prev.services[service] },
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + formData.photos.length > 3) {
      toast.error("You can only upload up to 3 images.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("gymName", formData.gymName);
      data.append("location", formData.location);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("fees", formData.fees);

      // Collecting only the selected services and storing them as strings (not numbers)
      const selectedServices = Object.keys(formData.services).filter((key) => formData.services[key]);
      data.append("services", JSON.stringify(selectedServices));

      formData.photos.forEach((file, index) => {
        data.append(`photo${index + 1}`, file);
      });

      console.log("FormData submitted");
      console.log(data);
      const resp = await AuthAxios.post("/api/gyms/create", data);
      if (resp.status === 201) {
        navigate('/success-page');
        toast.success("Gym added successfully!");
      }
    } catch (error) {
      if (error?.response?.data?.validationErrors) {
        // Show simpler validation error messages in the toast
        error.response.data.validationErrors.forEach((error) => {
          toast.error(error); // This assumes error messages are already simple strings like "Email field is required!"
        });
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <TopNav />
      <div className='flex flex-row w-full h-screen'>
        {/* Left Sidebar (Fixed) */}
        <div className='flex flex-col w-1/5 h-full'>
          <div className='w-full bg-gray-300 p-10'>
            <p className='text-3xl font-bold'>Gym List</p>
          </div>
          <div className='w-full bg-gray-400 p-10 space-y-4 flex-1'>
            <p className='text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer'
              onClick={() => navigate('/gym-list')}>Gym List</p>
            <p className='text-2xl font-bold p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer'
              onClick={() => navigate('/review-add')}>Reviews</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-gray-400 to-gray-50 p-6 rounded-xl shadow-md mt-10">
          <h2 className="text-xl font-bold text-gray-600 mb-4">GYM Details</h2>
          <div className="space-y-3 flex flex-col">
            <label htmlFor="gymName" className="flex justify-between">
              Gym Name
              <span className="text-xs text-gray-500 font-semibold mt-1">(Only letters/ numbers allowed)</span>
            </label>
            <input className='bg-gray-300 p-2 rounded-xl' onChange={handleValueChange} name="gymName" value={formData.gymName} />
            
            <label htmlFor="location" className="flex justify-between">
              Location
              <span className="text-xs text-gray-500 font-semibold mt-1">Required</span>
            </label>
            <input className='bg-gray-300 p-2 rounded-xl' onChange={handleValueChange} name="location" value={formData.location} />
            
            <label htmlFor="phone" className="flex justify-between">
              Phone Number
              <span className="text-xs text-gray-500 font-semibold mt-1">(Valid phone number format)</span>
            </label>
            <input className='bg-gray-300 p-2 rounded-xl' onChange={handleValueChange} name="phone" value={formData.phone} />
            
            <label htmlFor="email" className="flex justify-between">
              Email
              <span className="text-xs text-gray-500 font-semibold mt-1">(Must follow email format)</span>
            </label>
            <input className='bg-gray-300 p-2 rounded-xl' onChange={handleValueChange} name="email" value={formData.email} />
            
            <label htmlFor="fees" className="flex justify-between">
              Membership Fees
              <span className="text-xs text-gray-500 font-semibold mt-1">Required</span>
            </label>
            <input className='bg-gray-300 p-2 rounded-xl' onChange={handleValueChange} name="fees" value={formData.fees} />
          </div>

          <h3 className="mt-4 font-medium">Facilities & Services</h3>
          <div className="bg-gray-300 p-3 rounded-lg mt-2">
            {Object.entries(formData.services).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input type="checkbox" checked={value} onChange={() => handleCheckboxChange(key)} />
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              </div>
            ))}
          </div>

          <h3 className="mt-4 font-medium">Upload Photos (Max 3)</h3>
          <div className="mt-2 border p-4 rounded-lg flex flex-col items-center">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-2" />
            <div className="flex space-x-2">
              {formData.photos.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse justify-between mt-4 gap-3">
            <button
              variant="secondary"
              className="bg-gray-200 p-2 text-black cursor-pointer hover:bg-gray-300 transition duration-200"> Cancel </button>
            <button
              onClick={handleSubmit}
              className="bg-gray-500 p-2 text-white cursor-pointer hover:bg-gray-600 transition duration-200"> Save </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

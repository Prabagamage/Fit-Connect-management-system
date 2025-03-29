import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPen, FaTrash, FaSearch } from 'react-icons/fa';
import TopNav from '../components/TopNav';
import AuthAxios from '../utils/AuthAxios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const GymList = () => {
  const [gyms, setGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await AuthAxios.get('/api/gyms');
        setGyms(response.data);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      }
    };
    fetchGyms();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
    ));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      try {
        await AuthAxios.delete(`/api/gyms/${id}`);
        setGyms(gyms.filter(gym => gym._id !== id));
      } catch (error) {
        console.error("Error deleting gym:", error);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Gym List Report", 14, 10);
    const tableColumn = ["Gym Name", "Location", "Ratings"];
    const tableRows = gyms.map(gym => [gym.name, gym.location, gym.ratings]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("gym_list_report.pdf");
  };

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gym List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search gyms..."
              className="pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-black" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-400 text-black">
              <tr>
                <th className="py-3 px-6 text-left">Gym Name</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-center">Ratings</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGyms.length > 0 ? (
                filteredGyms.map((gym) => (
                  <tr key={gym._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6">{gym.name}</td>
                    <td className="py-3 px-6">{gym.location}</td>
                    <td className="py-3 px-6 text-center">{renderStars(gym.ratings)}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-3">
                        <button onClick={() => navigate(`/gym-view/${gym._id}`)} className="text-black hover:text-gray-700 cursor-pointer">
                          <FaEye size={20} />
                        </button>
                        <button onClick={() => navigate(`/gym-update/${gym._id}`)} className="text-black hover:text-gray-700 cursor-pointer">
                          <FaPen size={20} />
                        </button>
                        <button onClick={() => handleDelete(gym._id)} className="text-black hover:text-gray-700 cursor-pointer">
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No gyms found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center mt-4 space-y-2">
          <button onClick={() => navigate('/gym-add-new')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">Add New Gym</button>
          <button onClick={generatePDF} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">Generate Gym List Report</button>
        </div>
      </div>
      </div>
    </>
  );
};

export default GymList;
import React, { useState } from "react";
import AuthAxios from "../utils/AuthAxios";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await AuthAxios.post("api/users/register", {
        name,
        email,
        password,
        role,
      });

      toast("Registration successful!");
      navigate("/");
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <TopNav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" id="">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
            </select>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg">
              Register
            </button>

          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Register;

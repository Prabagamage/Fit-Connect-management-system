import React, { useState } from "react";
import AuthAxios from "../utils/AuthAxios";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import TopNav from "../components/TopNav";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await AuthAxios.post("api/users/login", {
        email,
        password,
      });

      localStorage.setItem("auth_token", resp.data.data.token);
      toast("Login successful!");
      navigate("/challenges");
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <TopNav />
      <div className="flex justify-center items-center min-h-screen bg-gray-700">
        <div className="bg-gray-800/90 shadow-lg rounded-xl p-12 w-full max-w-xl backdrop-blur-sm">
          <h2 className="text-4xl font-extrabold text-center text-teal-200 mb-10">Gym Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="border border-gray-600 bg-gray-700 text-teal-100 placeholder-gray-400 p-5 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="border border-gray-600 bg-gray-700 text-teal-100 placeholder-gray-400 p-5 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-gray-900 p-5 rounded-lg text-xl font-semibold">
              Login
            </button>
          </form>
          <p className="mt-8 text-center text-lg text-teal-100">
            Don't have an account?{" "}
            <span className="text-teal-200 cursor-pointer hover:underline" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
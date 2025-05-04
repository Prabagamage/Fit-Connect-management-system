import React, { useState } from "react";
import AuthAxios from "../utils/AuthAxios";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const context = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await AuthAxios.post("api/users/login", {
        email,
        password,
      });

      localStorage.setItem("auth_token", resp.data.data.token);
      context.setUser(resp.data.data.user)
      toast("Login successful!");
      const user = resp.data.data?.user
      if (user.role === "admin") navigate("/dashboard")
      if (user.role === "trainer") navigate("/trainer")
      if (user.role === "user") navigate("/challenges")
      console.log('Logged usr', user);
      // navigate("/challenges");
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <TopNav />
      <div className="flex justify-center items-center min-h-screen bg-gray-300">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Login;

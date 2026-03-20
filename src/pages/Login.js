import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute w-96 h-96 bg-indigo-500 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-500 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/20 w-[420px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="AERO Blog"
            className="w-28 drop-shadow-2xl hover:scale-105 transition duration-500"
          />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-wide">
          Welcome Back
        </h2>

        <p className="text-gray-300 text-sm text-center mb-6">
          Login to continue your journey
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl shadow-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

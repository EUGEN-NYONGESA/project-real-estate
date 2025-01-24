import { motion } from "framer-motion";
import bgVideo from "../assets/estatevideoBG.mp4";
import { useState } from "react";
import Input from "../components/Input";
import { Lock, Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = false;

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative h-screen w-full">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover blur-md"
        src={bgVideo}
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay Content */}
      <div className="relative flex items-center justify-center h-full w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-black bg-opacity-30 backdrop-filter 
            backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h4 className="text-xl font-bold mb-3 text-center text-orange-400 bg-clip-text">
              Welcome Back
            </h4>
            <h2 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text">
              Login
            </h2>

            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Input */}
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Forgot Password Link */}
              <div className="flex items-center mb-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                className="mt-4 w-full py-3 px-4 bg-orange-600 text-white font-bold 
                  rounded-lg shadow-lg hover:bg-orange-500 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                  focus:ring-offset-white transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader className = 'w-6 h-6 animate-spin mx-auto' /> : "Login"}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to = {"/signup"} className='text-orange-400 hover:underline'>
                    Sign up
                </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
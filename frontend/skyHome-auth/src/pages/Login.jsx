import { motion } from "framer-motion";
import bgVideo from "../assets/estatevideoBG.mp4";
import { useState, useContext } from "react";
import Input from "../components/Input";
import { Lock, Mail, Loader, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../components/context/AppContext";

const Login = () => {
  const { login, isLoading, error } = useContext(AppContext); // Access context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Show/Hide password

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password); // Call login from context
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

              {/* Password Input with Show Password Toggle */}
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

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
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-orange-400 hover:underline">
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
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock, Loader } from "lucide-react";
import bgVideo from "../assets/estatevideoBG.mp4";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { AppContext } from "../components/context/AppContext";

const Signup = () => {
  const { signup, isLoading, error, successMessage } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(name, email, password);
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
            <h4 className="text-xl font-bold mb-3 text-center text-orange-400">
              Create your agent account
            </h4>
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>

            <form onSubmit={handleSubmit}>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Password Strength Meter */}
              <PasswordStrengthMeter password={password} />

              {/* Error Message */}
              {error && <p className="text-red-400 font-semibold mt-3">{error}</p>}

              {/* Success Message */}
              {successMessage && <p className="text-green-400 font-semibold mt-3">{successMessage}</p>}

              <motion.button
                className="mt-5 w-full py-3 px-4 bg-orange-600 text-white font-bold 
                  rounded-lg shadow-lg hover:bg-orange-500 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                  focus:ring-offset-white transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </form>
          </div>
          <div className="px-8 bg-gray-900 bg-opacity-40 flex justify-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to={"/login"} className="text-orange-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
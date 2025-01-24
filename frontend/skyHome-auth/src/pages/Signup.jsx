import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock } from "lucide-react";

import bgVideo from "../assets/estatevideoBG.mp4";
import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const Signup = () => {
  const [name, setName] = useState(''); // Fixed destructuring
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
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
                    Welcome to SkyHomes
            </h4>
            <h2 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text">
              Create Account
            </h2>

            <form onSubmit={handleSignup}>
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
              {/* Password strength meter */}
              <PasswordStrengthMeter password = {password} />

              <motion.button className="mt-5 w-full py-3 px-4 bg-orange-600 text-white font-bold 
                  rounded-lg shadow-lg hover:bg-orange-500 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                  focus:ring-offset-white transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
              >
                Sign up
              </motion.button>
            </form>
          </div>
          <div className="px-8 bg-gray-900 bg-opacity-40 flex justify-center">
            <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link to = {"/login"} className='text-orange-400 hover:underline'>
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
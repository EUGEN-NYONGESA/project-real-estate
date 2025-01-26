import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/estatevideoBG.mp4";
import { motion } from "framer-motion";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const isLoading = false;

  // Handle changes in input fields
  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pasteCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasteCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last filled or next empty input
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log(`Verification code submitted: ${verificationCode}`);
  };

  // Automatically submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-black bg-opacity-30 backdrop-filter 
          backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              Verify Email
            </h2>
            <p className="text-center text-gray-300 mb-6">
              Enter the 6-digit code sent to your email address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white 
                    border-2 border-gray-500 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || code.some((digit) => !digit)}
                className="mt-4 w-full py-3 px-4 bg-orange-600 text-white font-bold 
                rounded-lg shadow-lg hover:bg-orange-500 focus:outline-none 
                focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                focus:ring-offset-white transition duration-200"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification;
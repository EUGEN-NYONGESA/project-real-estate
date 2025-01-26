import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = "http://localhost:5000/api/auth"; // Backend API URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // Store user data globally
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(null)

  // Signup function
  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear any previous success messages

    try {
      const response = await axios.post(`${backendUrl}/signup`, {
        name,
        email,
        password,
      });

      // Handle successful signup
      if (response.data.success) {
        setSuccessMessage(response.data.message); // Set success message
        console.log("Signup successful:", response.data);
        navigate("/verify-email"); // Redirect to the verification page
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed! Try again later.";
      setError(errorMessage); // Set error message
    } finally {
      setIsLoading(false);
    }
  };  
  
  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/login`, {
        email,
        password,
      });

      // If account is not verified, redirect to verification page
      if (!response.data.isVerified) {
        navigate("/verify-email");
        return;
      }

      // Set user data globally and navigate to home
      setUser(response.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Wrong email or password!");
    } finally {
      setIsLoading(false);
    }
  };

  /*
  // Logout function (optional for future)
  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/logout`);
      setUser(null); // Clear the user data
    } catch (err) {
      setError("Error Logging Out");
    }
  };
  */

  // Provide context values to children
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        isLoading,
        error,
        successMessage, // Provide successMessage state
        signup,
        backendUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
import { Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import EmailVerification from "./pages/EmailVerification"


const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
    </div>
  )
}

export default App

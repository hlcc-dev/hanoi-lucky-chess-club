import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/ResetPassword';
import ChessPuzzle from './pages/ChessPuzzle';
import Leaderboard from './pages/Leaderboard';


import ToastContainer from './components/Toast/ToastContainer';


function App() {
  return (
    <div className="min-h-screen flex flex-col">

      <ToastContainer />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/chess-puzzles" element={<ChessPuzzle />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/members" element={<h1>Members</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App